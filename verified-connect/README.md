# Verified Connect

Verified Connect is an Expo React Native app backed by Supabase. The project is set up for profile discovery, swipe actions, matches, and Supabase Auth integration.

## Stack

- Expo 54
- React 19 and React Native 0.81
- TypeScript
- NativeWind and Tailwind CSS
- Supabase JavaScript client
- Supabase SQL migrations

## Project Layout

```text
.
|-- App.tsx
|-- src/
|   |-- components/
|   |-- hooks/
|   |-- lib/
|   `-- screens/
`-- supabase/
    |-- config.toml
    `-- migrations/
```

## Environment

Create `verified-connect/.env` with the Supabase project URL and publishable anon key:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

The current local `.env` points at project ref `bbfrljayzlmtjdncfrak`.

## Install

```bash
npm install
```

## Run

```bash
npm run start
npm run android
npm run ios
npm run web
```

## Apply Supabase Migrations

Run Supabase CLI commands from this directory:

```bash
cd /home/anu/Workspace/Biz/osun/verified-connect
```

Authenticate and link the project:

```bash
supabase login
supabase link --project-ref bbfrljayzlmtjdncfrak -p '<DB_PASSWORD>'
```

Preview pending migrations:

```bash
supabase migration list --linked -p '<DB_PASSWORD>'
supabase db push --linked --dry-run -p '<DB_PASSWORD>'
```

Apply the migrations:

```bash
supabase db push --linked -p '<DB_PASSWORD>'
```

Verify the core tables:

```bash
supabase db query --linked "select tablename from pg_tables where schemaname = 'public' and tablename in ('users','swipes','matches');"
```

Note: `supabase/migrations/005_seed_dummy_users.sql` inserts into `auth.users` and then inserts matching rows into `public.users`. Because `004_auth_trigger_create_user.sql` creates profile rows automatically after auth user creation, the seed migration may need adjustment before being applied to a remote database.

## License

This project is licensed under the GNU Affero General Public License v3.0. See [LICENSE.md](./LICENSE.md).
