-- 002_create_swipes_table
create table public.swipes (
  id uuid default gen_random_uuid() primary key,
  swiper_id uuid references public.users(id) not null,
  swiped_id uuid references public.users(id) not null,
  action text not null check (action in ('like', 'pass')),
  created_at timestamp with time zone default now(),
  unique(swiper_id, swiped_id)
);

alter table public.swipes enable row level security;

create policy "Users can read own swipes"
  on public.swipes for select
  using (auth.uid() = swiper_id);

create policy "Users can insert own swipes"
  on public.swipes for insert
  with check (auth.uid() = swiper_id);

create policy "Users can delete own swipes"
  on public.swipes for delete
  using (auth.uid() = swiper_id);