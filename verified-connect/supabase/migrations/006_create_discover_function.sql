-- 006_create_discover_function
-- RPC to fetch users the current user hasn't swiped on yet

create or replace function discover_users()
returns setof users
language sql
security definer
as $$
  select * from public.users
  where id != auth.uid()
    and id not in (
      select swiped_id from public.swipes
      where swiper_id = auth.uid()
    )
  order by random()
  limit 20;
$$;

grant execute on function discover_users() to authenticated;