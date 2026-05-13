-- 003_create_matches_table
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.users(id) not null,
  user2_id uuid references public.users(id) not null,
  created_at timestamp with time zone default now(),
  unique(user1_id, user2_id)
);

alter table public.matches enable row level security;

create policy "Users can read own matches"
  on public.matches for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "System can insert matches"
  on public.matches for insert
  with check (true);