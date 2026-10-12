# JapSadhna for Android

The Android app is the same web app (`index.html`, `css/`, `js/`) packaged with
[Capacitor](https://capacitorjs.com). Inside the app it uses Android's own features:

| Feature | In the app |
| --- | --- |
| Follow voice | Android speech recognition (`@capacitor-community/speech-recognition`) with live partial results |
| Auto counting (voice + pause) | microphone through the WebView |
| Scan a prayer | camera / gallery picker, text read with Tesseract |
| Google sign-in | opens in the browser (Google does not allow sign-in inside apps) and returns via `com.sjpt.mantrajaap://login-callback` |
| Share | Android share sheet |
| Screen stays on while chanting | `@capacitor-community/keep-awake` |
| Back button | closes a panel → leaves practice → exits |

## Getting the app

Every push to `main` builds the app on GitHub Actions (`.github/workflows/android.yml`) and publishes it:

**https://github.com/Jitesh-57/mantra-jaap/releases/latest** → `japsadhna.apk`

Open that link on the phone, download, and open the file (allow "Install unknown apps" for the browser
if Android asks). New builds install over the old one.

## One-time setting for Google sign-in in the app

Supabase → **Authentication → URL Configuration → Redirect URLs** → add:

    com.sjpt.mantrajaap://login-callback

## Building locally (optional)

Needs Node 22, JDK 21 and Android Studio / Android SDK 36.

    npm ci
    npm run android:sync      # copies the web app into android/ and updates plugins
    npm run android:open      # opens Android Studio

## Publishing on Google Play

1. **Upload key**: `android/upload.jks` (alias `upload`). The file is protected by a password that is
   stored only in the GitHub secret `ANDROID_KEYSTORE_PASSWORD` (repo → Settings → Secrets and variables →
   Actions). Keep that password safe as well — Play needs the same upload key for every update
   (if it is ever lost, the key can be reset through Play Console support).

2. When the secret is set, every build also publishes **`japsadhna-play.aab`** on the releases page.
   The Play package name is `myapp.japsadhna`.

3. **Play Console** (one-time $25): create the app "JapSadhna", turn on Play App Signing, upload `japsadhna-play.aab`
   to Internal testing first.
   - Store listing artwork: `store/icon_512.png`, `store/feature_1024x500.png`, plus phone screenshots.
   - Privacy policy URL is required (the app uses the microphone, camera and accounts).
   - Data safety: account email (for sign-in), audio is processed by the speech recogniser and not stored.

The test APK on the releases page is signed with a shared test key (`android/app/debug.keystore`);
it is for testing only and is never used for Play.
