import { createClient } from "@nhost/nhost-js";

let client;

export function getNhost() {
  if (!client) {
    client = createClient({
      subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "cwsjbwgymssxaxxgfhov",
      region: process.env.NEXT_PUBLIC_NHOST_REGION || "ap-south-1"
    });
  }
  return client;
}

export async function saveOnboarding(payload) {
  const nhost = getNhost();
  const session = nhost.getUserSession();
  if (!session?.user?.id) throw new Error("Your session has expired. Please sign in again.");

  const profile = await nhost.graphql.request({
    query: `
      mutation SaveCustomerProfile($object: customer_profiles_insert_input!) {
        insert_customer_profiles_one(
          object: $object,
          on_conflict: {constraint: customer_profiles_pkey, update_columns: [
            full_name, phone, job_title, company_name, company_website,
            industry, company_size, country
          ]}
        ) { user_id }
      }
    `,
    variables: {
      object: {
        full_name: payload.fullName,
        phone: payload.phone,
        job_title: payload.jobTitle || null,
        company_name: payload.companyName || null,
        company_website: payload.companyWebsite || null,
        industry: payload.industry || null,
        company_size: payload.companySize || null,
        country: payload.country || null
      }
    }
  });
  if (profile.body?.errors?.length) throw new Error(profile.body.errors[0].message);

  const request = await nhost.graphql.request({
    query: `
      mutation CreateServiceRequest($object: service_requests_insert_input!) {
        insert_service_requests_one(object: $object) { id }
      }
    `,
    variables: {
      object: {
        services: payload.services,
        budget: payload.budget || null,
        timeline: payload.timeline || null,
        project_brief: payload.projectBrief || null,
        status: "new"
      }
    }
  });
  if (request.body?.errors?.length) throw new Error(request.body.errors[0].message);
  return true;
}
