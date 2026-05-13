-- 004_auth_trigger_create_user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url, is_verified)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();