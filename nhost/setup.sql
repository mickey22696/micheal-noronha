-- MICHEAL NORONHA client portal schema
-- Run in Nhost Dashboard -> Database -> SQL Editor.
-- After running, track all four public tables in Hasura / GraphQL.

create extension if not exists pgcrypto;

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on update cascade on delete cascade,
  full_name text not null,
  phone text not null,
  job_title text,
  company_name text,
  company_website text,
  industry text,
  company_size text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on update cascade on delete cascade,
  services text[] not null default '{}',
  budget text,
  timeline text,
  project_brief text,
  status text not null default 'new'
    check (status in ('new','reviewing','proposal','in_progress','on_hold','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on update cascade on delete cascade,
  service_request_id uuid references public.service_requests(id) on delete set null,
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on update cascade on delete cascade,
  service_request_id uuid references public.service_requests(id) on delete set null,
  invoice_number text,
  amount numeric(12,2) not null default 0,
  currency text not null default 'INR',
  status text not null default 'pending'
    check (status in ('draft','pending','paid','overdue','cancelled')),
  due_date date,
  payment_url text,
  created_at timestamptz not null default now()
);

create index if not exists service_requests_user_created_idx
  on public.service_requests(user_id, created_at desc);
create index if not exists project_updates_user_created_idx
  on public.project_updates(user_id, created_at desc);
create index if not exists invoices_user_created_idx
  on public.invoices(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_profiles_updated_at on public.customer_profiles;
create trigger customer_profiles_updated_at before update on public.customer_profiles
for each row execute function public.set_updated_at();

drop trigger if exists service_requests_updated_at on public.service_requests;
create trigger service_requests_updated_at before update on public.service_requests
for each row execute function public.set_updated_at();
