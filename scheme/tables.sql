create table public.profiles (
  id uuid not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  first_name character varying null,
  last_name character varying null,
  profile_image text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id)
) TABLESPACE pg_default;

create table public.invoices (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  profile_id uuid not null,
  supplier_name character varying null,
  supplier_number character varying null,
  amount numeric null,
  currency character varying null default 'EUR'::character varying,
  invoice_date date null,
  due_date date null,
  status public.status_invoice not null default 'pending'::status_invoice,
  file_url text null,
  bank_account_details text null,
  notes text null,
  tax numeric null,
  discount numeric not null default '0'::numeric,
  shipping_fee numeric not null default '0'::numeric,
  client_id uuid null,
  constraint invoices_pkey primary key (id),
  constraint invoices_supplier_number_key unique (supplier_number),
  constraint invoices_client_id_fkey foreign KEY (client_id) references clients (id),
  constraint invoices_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;

create table public.invoice_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  invoice_id uuid not null,
  description text not null,
  unit_cost numeric not null,
  quantity numeric not null,
  amount numeric not null,
  constraint invoice_items_pkey primary key (id),
  constraint invoice_items_invoice_id_fkey foreign KEY (invoice_id) references invoices (id)
) TABLESPACE pg_default;

create table public.clients (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  profile_id uuid not null,
  name text not null,
  email text null,
  phone text null,
  website text null,
  company_name text null,
  vat_number text null,
  tax_code text null,
  address text null,
  city text null,
  postal_code text null,
  country text null,
  logo_url text null,
  status public.status_client not null default 'active'::status_client,
  total_invoiced numeric not null default '0'::numeric,
  invoices_count bigint not null default '0'::bigint,
  last_invoice_at timestamp with time zone null,
  notes text null,
  constraint clients_pkey primary key (id),
  constraint clients_vat_number_key unique (vat_number),
  constraint clients_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;

create table public.activities (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  profile_id uuid not null,
  type public.status_activities not null,
  title text not null,
  description text null,
  entity_type text not null,
  entity_id uuid null,
  metadata jsonb null,
  constraint activities_pkey primary key (id),
  constraint activities_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;