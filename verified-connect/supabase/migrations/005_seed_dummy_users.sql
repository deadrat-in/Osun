-- 005_seed_dummy_users
-- Only seed auth.users; the trigger (004) auto-creates public.users rows

insert into auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'alice@example.com',
    crypt('Test1234!', gen_salt('bf'))::text,
    now(),
    '{"provider":"linkedin_oidc","providers":["linkedin_oidc"]}'::jsonb,
    '{"full_name":"Alice Chen","avatar_url":"https://i.pravatar.cc/300?img=1"}'::jsonb,
    now(), now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'bob@example.com',
    crypt('Test1234!', gen_salt('bf'))::text,
    now(),
    '{"provider":"linkedin_oidc","providers":["linkedin_oidc"]}'::jsonb,
    '{"full_name":"Bob Martinez","avatar_url":"https://i.pravatar.cc/300?img=2"}'::jsonb,
    now(), now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'carol@example.com',
    crypt('Test1234!', gen_salt('bf'))::text,
    now(),
    '{"provider":"linkedin_oidc","providers":["linkedin_oidc"]}'::jsonb,
    '{"full_name":"Carol Johnson","avatar_url":"https://i.pravatar.cc/300?img=3"}'::jsonb,
    now(), now()
  );