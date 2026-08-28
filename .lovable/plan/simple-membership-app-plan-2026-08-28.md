# Simple Membership App — Plan

A "hello world"-style membership app: a public welcome page, email/password login + sign up, and a members-only area showing a default membership page personalized with the member's name.

## Look & feel
- Clean & minimal: white background, light gray surfaces, near-black text, blue accent (#3b82f6)
- Headings: Outfit; body: Figtree (loaded via `<link>` in the root route)
- Centered card layouts, generous whitespace, rounded corners

## Pages / routes
1. `/` — Welcome page: "Hello, welcome!" hero, short tagline, and Sign in / Create account buttons. If already signed in, shows a "Go to your membership area" button.
2. `/auth` — Login & sign up (tabbed card):
   - Sign up: display name + email + password → "check your email to confirm" state
   - Login: email + password → redirects to `/members`
   - Includes a "Forgot password?" link
3. `/reset-password` — public page to set a new password from the recovery email link
4. `/members` — protected membership area (redirects to `/auth` when signed out):
   - Greets the member by display name ("Welcome, {name}!")
   - Example placeholder content: "This is your default membership page — you can modify this as needed", plus a few sample content cards
   - Sign out button (clears session, returns to `/auth`)

## Backend (Lovable Cloud)
- Enable Lovable Cloud for auth + database
- `profiles` table: `id` (FK to auth.users, cascade), `display_name`, timestamps
  - Grants + RLS: users can only read/update their own profile
  - Trigger auto-creates a profile on signup (display name passed via signup metadata)
- Signup uses `emailRedirectTo` so the confirmation email returns to the app
- Protected data access via the integration's `_authenticated` gate; session-aware header affordance (Sign in ↔ member menu/sign out)

## SEO
- Unique `head()` title/description per route (no "Lovable App" placeholders)

## Verification
- Build passes clean, then Playwright check: welcome page renders, signup/login flow, redirect to `/members`, sign out returns to `/auth`
