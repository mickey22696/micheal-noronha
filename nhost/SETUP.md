# Nhost setup — client onboarding portal

The portal is configured for the Nhost project you supplied:
- Subdomain: `cwsjbwgymssxaxxgfhov`
- Region: `ap-south-1`
- SDK: `@nhost/nhost-js`

## 1. Create the database

1. Open your Nhost project dashboard.
2. Go to **Database → SQL Editor**.
3. Run the complete contents of `nhost/setup.sql`.
4. Track all four tables in Hasura / GraphQL:
   - `public.customer_profiles`
   - `public.service_requests`
   - `public.project_updates`
   - `public.invoices`

## 2. Configure row-level permissions before accepting customers

For role `user`, use this row filter on each table:

```json
{ "user_id": { "_eq": "X-Hasura-User-Id" } }
```

### customer_profiles
- SELECT: all columns; row filter above.
- INSERT: allow `full_name, phone, job_title, company_name, company_website, industry, company_size, country`; preset `user_id` to `X-Hasura-User-Id`.
- UPDATE: allow the same profile columns; row filter and check filter above.
- No customer DELETE permission.

### service_requests
- SELECT: all columns; row filter above.
- INSERT: allow `services, budget, timeline, project_brief`; preset `user_id` to `X-Hasura-User-Id` and `status` to `new`.
- No customer UPDATE or DELETE permission. Customers must not be allowed to set their own `user_id` or project status.

### project_updates and invoices
- SELECT only, with the same user_id row filter.
- No customer INSERT, UPDATE or DELETE permission.

### admin role
Create an `admin` role and grant it the required SELECT/INSERT/UPDATE permissions on all four tables. Assign this role only to your own trusted account through Nhost Auth user management. The UI checks this role, but the real protection comes from Hasura permissions.

**Never put an Nhost admin secret or service-role key in browser code or a `NEXT_PUBLIC_*` variable.**

## 3. Configure Nhost Auth redirects

In **Auth → Settings → Redirect URLs**, allow:
- `https://www.michealnoronha.com/portal/verify`
- `https://micheal-noronha.vercel.app/portal/verify`

For preview testing, add a restricted Vercel preview URL pattern if you need it. Keep email verification enabled; the app uses PKCE.

## 4. Vercel environment variables

The project has safe defaults for your Nhost project. You can also set:
- `NEXT_PUBLIC_NHOST_SUBDOMAIN=cwsjbwgymssxaxxgfhov`
- `NEXT_PUBLIC_NHOST_REGION=ap-south-1`

## 5. Test the complete flow

1. Open `/onboard` and register with an inbox you can access.
2. Verify the email using Nhost's message.
3. Confirm the account lands on `/portal`.
4. Confirm a customer profile and service request appear in the Nhost database.
5. Sign out, then sign back in at `/portal/sign-in`.
6. Register a second test user and verify that the first user's records are not visible to them.

## Included features

- Multi-step customer onboarding and account creation.
- Email verification using PKCE.
- Customer dashboard with service requests, statuses, project updates, invoices/payment links and editable profile.
- Admin workspace for accounts assigned the `admin` role.
- Database row permissions designed to keep each customer's data private.
