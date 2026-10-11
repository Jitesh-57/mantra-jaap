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

1. **Create an upload key** (keep the file and passwords safe — Play needs the same key for every update):

       keytool -genkeypair -v -keystore japsadhna-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000

2. **Add GitHub secrets** (repo → Settings → Secrets and variables → Actions):
   - `ANDROID_KEYSTORE_BASE64` – output of `base64 -w0 japsadhna-upload.jks`
   - `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`upload`), `ANDROID_KEY_PASSWORD`

   The next build then also produces `japsadhna-play.aab` (in the workflow run's artifacts) for Play Console.

3. **Play Console** (one-time $25): create the app "JapSadhna", turn on Play App Signing, upload the `.aab`
   to Internal testing first.
   - Store listing artwork: `store/icon_512.png`, `store/feature_1024x500.png`, plus phone screenshots.
   - Privacy policy URL is required (the app uses the microphone, camera and accounts).
   - Data safety: account email (for sign-in), audio is processed by the speech recogniser and not stored.

The test APK on the releases page is signed with a shared test key (`android/app/debug.keystore`);
it is for testing only and is never used for Play.
