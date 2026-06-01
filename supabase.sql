
create table if not exists accounts (
 id uuid primary key default gen_random_uuid(),
 monster_name text not null,
 price bigint not null,
 description text,
 image_urls text[],
 created_at timestamptz default now()
);

alter table accounts enable row level security;

create policy "Enable read access for all users"
on public.accounts
for select using (true);
