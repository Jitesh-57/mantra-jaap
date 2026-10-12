// Supabase project used for sign-in and saving data to the user's account.
// Both values are meant to be public (Supabase → Project Settings → API);
// the database is protected by the row-level security rules in supabase/schema.sql.
// Leave them empty to run the app without accounts.
export const SUPABASE_URL = 'https://lwworujvfttxkrjfrgav.supabase.co'; // shared with sjpt.io
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3d29ydWp2ZnR0eGtyamZyZ2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDAyMDYsImV4cCI6MjA5NjQ3NjIwNn0.-v6wXpjQqVt8wy2lPYikxT-kyGMwL-4ohgqJNwnZzvQ';

// Google AdMob banner shown on the home screen of the Android app (never on the website).
// Ad unit "Home banner" (AdMob → Apps → JapSadhna → Ad units). Google's test banner for development:
// ca-app-pub-3940256099942544/9214589741. The app ID is in android/app/src/main/res/values/strings.xml.
export const ADMOB_BANNER_ID = 'ca-app-pub-6299138657923728/4199181521';
