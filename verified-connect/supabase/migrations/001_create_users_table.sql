-- 001_create_users_table
create table public.users (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  bio text,
  is_verified boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.users enable row level security;

create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.users for delete
  using (auth.uid() = id);