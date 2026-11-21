# Nhost setup — client onboarding portal

Configured for the Nhost project supplied for this website:
- Subdomain: `cwsjbwgymssxaxxgfhov`
- Region: `ap-south-1`
- SDK: `@nhost/nhost-js`

## 1. Create the database
1. Open Nhost Dashboard → **Database → SQL Editor**.
2. Run all of `nhost/setup.sql`.
3. Track these tables in Hasura / GraphQL: `customer_profiles`, `service_requests`, `project_updates`, `invoices`.

## 2. Set permissions before accepting customers

For role `user`, use row filter `{ "user_id": { "_eq": "X-Hasura-User-Id" } }` on all four tables.

**customer_profiles / user**
- SELECT: all columns, row filter above.
- INSERT: allow `full_name, phone, job_title, company_name, company_website, industry, company_size, country`; preset `user_id` to `X-Hasura-User-Id`.
- UPDATE: allow those same profile columns; row filter and check filter above.
- No DELETE.

**service_requests / user**
- SELECT: all columns, row filter above.
- INSERT: allow `services, budget, timeline, project_brief`; preset `user_id` to `X-Hasura-User-Id` and `status` to `new`.
- No UPDATE or DELETE. Customers must not set their own user_id or project status.

**project_updates and invoices / user**
- SELECT only, with the same user_id row filter. No customer INSERT, UPDATE or DELETE.

**admin role**
- Create an `admin` role. Grant it SELECT/INSERT/UPDATE on all four tables (and INSERT on project_updates/invoices); assign it only to your trusted owner account through Nhost Auth user management. The app checks this role, but Hasura permissions enforce actual data access.

Never expose an Nhost admin secret or service-role key in browser code or any `NEXT_PUBLIC_*` variable.

## 3. Authentication redirect URLs
In **Auth → Settings → Redirect URLs**, allow:
- `https://www.michealnoronha.com/portal/verify`
- `https://micheal-noronha.vercel.app/portal/verify`

For preview testing, add a restricted Vercel preview URL pattern if required. Keep email verification enabled; the app uses PKCE.

## 4. Vercel environment variables
The code already has safe public defaults. Optional explicit values:
- `NEXT_PUBLIC_NHOST_SUBDOMAIN=cwsjbwgymssxaxxgfhov`
- `NEXT_PUBLIC_NHOST_REGION=ap-south-1`

## 5. Test
1. Visit `/onboard`, register using an inbox you can access and verify the email.
2. Confirm the account lands on `/portal` and profile + service request rows appear.
3. Sign out and sign back in at `/portal/sign-in`.
4. Register a second test user and confirm they cannot see the first user's records.
5. Assign the `admin` role to your own account in Nhost and open `/portal/admin`. Test status changes, project updates and invoice creation.

## Included
Multi-step onboarding; PKCE email verification; private customer dashboard; service requests and statuses; project updates; invoices/payment links; profile editing; admin operations workspace. No admin secret is used by the browser.
