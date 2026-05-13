# Project Overview: Verified Connect (POC)
You are an expert React Native/Expo developer and Supabase architect. You are building a Proof of Concept (POC) for a safe, verified dating web-app.

## 1. Tech Stack & Constraints
* **Framework:** Expo (React Native) with Web support enabled (`npx create-expo-app -t expo-template-blank-typescript`).
* **Backend & Auth:** Supabase (PostgreSQL, Auth).
* **Styling:** NativeWind (Tailwind CSS for React Native) for rapid UI development.
* **Navigation:** React Navigation (Stack and Bottom Tabs).
* **Core UI:** `react-native-deck-swiper` for card mechanics.
* **Constraint:** STRICTLY LinkedIn OAuth only. No email/password signup. 

## 2. Database Schema (Supabase)
Create the following tables via SQL migrations or the Supabase JS client. Enable Row Level Security (RLS) so users can only edit their own data.

* `users`: 
    * `id` (uuid, references auth.users)
    * `full_name` (text, pulled from LinkedIn)
    * `avatar_url` (text, pulled from LinkedIn)
    * `bio` (text, editable)
    * `is_verified` (boolean, default true upon LinkedIn login)
* `swipes`:
    * `id` (uuid)
    * `swiper_id` (uuid, references users.id)
    * `swiped_id` (uuid, references users.id)
    * `action` (text: 'like' or 'pass')
* `matches`:
    * `id` (uuid)
    * `user1_id` (uuid)
    * `user2_id` (uuid)
    * `created_at` (timestamp)

## 3. App Architecture & Routing

**Unauthenticated Stack:**
* `LoginScreen`: A clean UI with a single call to action: "Sign in with LinkedIn". Use `supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc' })`.

**Authenticated Stack (Bottom Tabs):**
* `ProfileScreen`: Shows the user's fetched LinkedIn photo, name, and an editable text input for their bio.
* `DiscoverScreen`: Fetches users from the database who are NOT in the `swipes` table for the current user. Displays them using `react-native-deck-swiper`.
    * *Action:* On swipe right, insert a 'like' into the `swipes` table. Check if a mutual 'like' exists. If yes, insert a row into the `matches` table.
* `MatchesScreen`: Displays a list of mutual matches (querying the `matches` table joined with the `users` table to show names/avatars).

## 4. Execution Phases
Do not build the whole app at once. Complete this phase by phase and ask for my approval before moving to the next.

* **Phase 1:** Initialize Expo with Web support, setup NativeWind, and configure the Supabase client.
* **Phase 2:** Build the `LoginScreen` and wire up the LinkedIn OAuth flow. Ensure the user's session is persisted and their basic info is saved to the `users` table upon first login.
* **Phase 3:** Build the `ProfileScreen` so the user can see their verified data and add a bio.
* **Phase 4:** Build the `DiscoverScreen`. Seed the database with 3 dummy users manually so we can test the `react-native-deck-swiper` component.
* **Phase 5:** Implement the swipe logic (writing to `swipes` table) and the matching logic (writing to `matches` table).
* **Phase 6:** Build the `MatchesScreen` list view.
