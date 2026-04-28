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
  constraint invoices_pkey primary key (id),
  constraint invoices_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;