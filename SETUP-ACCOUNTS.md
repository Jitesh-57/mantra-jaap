# Turning on sign-in (Google + email)

The app works without accounts. Sign-in switches on as soon as `js/config.js`
has a Supabase project URL and anon key. About 10 minutes, all free.

## 1. Create a Supabase project
1. Go to https://supabase.com/dashboard → **New project** (keep it separate from other apps).
2. Name it `mantra-jaap`, pick a region close to your users (e.g. Mumbai), set a database password, **Create**.

## 2. Create the table
1. In the project: **SQL Editor** → **New query**.
2. Paste everything from `supabase/schema.sql` → **Run**.
   This creates one private row per user; nobody can read anyone else's data.

## 3. Website address
**Authentication → URL Configuration**
- Site URL: `https://mantra-jaap-delta.vercel.app`
- Redirect URLs → Add: `https://mantra-jaap-delta.vercel.app/**`
  (add your own domain too if you connect one later)

## 4. Email sign-in
**Authentication → Sign In / Providers → Email**: enabled (default).
"Confirm email" on is recommended — new users get a confirmation link.

## 5. Google sign-in
1. https://console.cloud.google.com → create/select a project.
2. **APIs & Services → OAuth consent screen**: External, app name "Mantra Jaap", your email → save.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorised redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (copy the exact value from Supabase → Authentication → Providers → Google)
4. Copy the **Client ID** and **Client secret** into Supabase → **Authentication → Providers → Google** → enable → Save.

## 6. Connect the app
Supabase → **Project Settings → API**: copy **Project URL** and the **anon public** key into `js/config.js`:

```js
export const SUPABASE_URL = 'https://xxxx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJ...';
```

Both values are designed to be public; the table's security rules protect the data.
Push to `main` and Vercel publishes it.

## How it behaves
- **Guests** can use everything, but settings (theme, language, colours, wallpaper…) reset on the next visit.
  Their mantras and counts stay on the device.
- **Signed in**: mantras, counts, day plans and settings are saved to the account and come back on any phone.
  On first sign-in, anything made as a guest on that device is added to the account.
- **Sign out** clears this device back to a fresh guest state; everything stays in the account.
