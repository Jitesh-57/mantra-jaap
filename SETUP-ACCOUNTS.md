# Turning on sign-in (Google + email)

JapSadhna uses the **same Supabase project as sjpt.io** (`lwworujvfttxkrjfrgav`).
Its data lives in its own table, `mantra_user_data`, and doesn't touch any sjpt table.
Sign-in switches on as soon as `js/config.js` has both the project URL and the anon key.

## 1. Create the table (once)
Supabase → **SQL Editor** → **New query** → paste everything from `supabase/schema.sql` → **Run**.
It only creates `mantra_user_data` with rules so each person can only see their own row.

## 2. Allow the JapSadhna address
Supabase → **Authentication → URL Configuration → Redirect URLs** → **Add URL**:
`https://mantra-jaap-delta.vercel.app/**`

Leave the **Site URL** as sjpt.io. JapSadhna passes its own address when it signs people in.

## 3. Anon key
Supabase → **Project Settings → API** → copy the **anon public** key
(the same value as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the sjpt Vercel project)
into `js/config.js`:

```js
export const SUPABASE_ANON_KEY = 'eyJ...';
```

It is designed to be public; the table rules protect the data. Push to `main` and Vercel publishes it.

Google and email sign-in are already enabled in this project for sjpt.io, so nothing else is needed.

## Good to know with a shared project
- One login works for both apps: someone with an sjpt.io account can sign in to JapSadhna with it, and the reverse.
- The Google consent screen and the confirmation / password-reset emails use the names set up for sjpt.io.
- Both apps share the project's free-tier limits (50,000 monthly active users, 500 MB database).

## How it behaves
- **Guests** can use everything, but settings (theme, language, colours, wallpaper…) reset on the next visit.
  Their mantras and counts stay on the device.
- **Signed in**: mantras, counts, day plans and settings are saved to the account and come back on any phone.
  On first sign-in, anything made as a guest on that device is added to the account.
- **Sign out** clears this device back to a fresh guest state; everything stays in the account.
