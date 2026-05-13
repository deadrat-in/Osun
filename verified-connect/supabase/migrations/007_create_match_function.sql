-- 007_create_match_function
-- Server-side function to record a swipe and atomically check for mutual match

create or replace function process_swipe(
  p_swiped_id uuid
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_swiper_id uuid;
  v_mutual_like boolean;
  v_match_id uuid;
begin
  v_swiper_id := auth.uid();

  -- Insert the swipe
  insert into swipes (swiper_id, swiped_id, action)
  values (v_swiper_id, p_swiped_id, 'like');

  -- Check if the other user already liked us
  select exists (
    select 1 from swipes
    where swiper_id = p_swiped_id
      and swiped_id = v_swiper_id
      and action = 'like'
  ) into v_mutual_like;

  -- If mutual like, create a match
  if v_mutual_like then
    -- Use LEAST/GREATEST to ensure user1_id < user2_id (prevents duplicate matches)
    insert into matches (user1_id, user2_id)
    values (
      case when v_swiper_id < p_swiped_id then v_swiper_id else p_swiped_id end,
      case when v_swiper_id < p_swiped_id then p_swiped_id else v_swiper_id end
    )
    on conflict (user1_id, user2_id) do nothing
    returning id into v_match_id;

    return json_build_object(
      'swipe_recorded', true,
      'is_match', true,
      'match_id', v_match_id
    );
  end if;

  return json_build_object(
    'swipe_recorded', true,
    'is_match', false,
    'match_id', null
  );
end;
$$;

grant execute on function process_swipe(uuid) to authenticated;