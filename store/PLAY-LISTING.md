# JapSadhna — Google Play listing and form answers

Package name: `myapp.japsadhna` · Upload file: `japsadhna-play.aab` (releases page)

## Store listing

**App name** (max 30): `JapSadhna: Mantra Jaap Counter`

**Short description** (max 80):
`Count mantra jaap by voice or tap, read aartis & chalisa with live highlighting`

**Full description:**

```
JapSadhna (जपसाधना) is a calm, simple companion for your daily jaap and prayers.

Chant aloud and JapSadhna counts each recitation for you. Chant in your mind and just tap. Your mala of 108 — or any number you choose — is tracked bead by bead, round after round.

• Voice counting – chant aloud and every recitation is counted automatically
• Tap counting – for silent, mental jaap
• Follow voice – words light up as you read, like song lyrics, so you never lose your place in long prayers
• Prayer library – Hanuman Chalisa, Gayatri Mantra, Mahamrityunjaya, Om Jai Jagdish Hare, Sukhkarta Dukhharta, Shiv Panchakshar, Madhurashtakam and many more mantras, aartis and stotras
• Search in any language – type “hanuman”, “हनुमान” or “गणपती” and find the right prayer
• Your own mantras – type them, paste them, or scan a prayer book page with the camera
• Sankalp plans – set a count and a number of days (for example 108 for 40 days) and see your progress each day
• Today’s count, rounds and total jaap for every mantra
• Beautiful themes, colours, wallpapers and text size for comfortable reading
• App in English, हिन्दी and मराठी
• Works without an account; sign in with Google or email to keep your mantras and settings on all your devices

Made with devotion for daily sadhana. 🙏
```

**App category:** Lifestyle · **Tags:** Religion, Meditation
**Contact email:** patil.jitesh866@gmail.com
**Website:** https://mantra-jaap-delta.vercel.app
**Privacy policy:** https://mantra-jaap-delta.vercel.app/privacy

**Graphics** (in this folder):
- App icon 512×512: `icon_512.png`
- Feature graphic 1024×500: `feature_1024x500.png`
- Phone screenshots 1080×1920: `screenshots/1_home.png` … `5_settings.png`

## App content (Policy → App content)

| Form | Answer |
| --- | --- |
| Privacy policy | https://mantra-jaap-delta.vercel.app/privacy |
| Ads | **Yes** — a Google AdMob banner on the home screen of the Android app |
| Advertising ID | **Yes** — used by the AdMob SDK for **Advertising or marketing** (and fraud prevention) |
| App access | **All or some functionality is restricted** → add instructions: "Sign-in is optional. All counting, reading and library features work without an account. Signing in only syncs your mantras and settings." Provide a test email + password created in the app. |
| Target audience | 13–15, 16–17, 18 and over (not for children under 13) |
| Content rating | Category: *Reference, News, or Educational* (or Utility). Answer **No** to every question about violence, sexual content, language, drugs, gambling. Users can't interact or share content with each other. |
| News app | No |
| Government app | No |
| Financial features | None |
| Health | None |
| Data safety | see below |
| Account deletion URL | https://mantra-jaap-delta.vercel.app/delete-account (in the app: tap your picture → *Delete my account*) |

## Data safety

- Does the app collect or share user data? **Yes**
- Encrypted in transit? **Yes**
- Can users request deletion? **Yes**

Data **collected** (not shared), all **optional**, purpose **App functionality** and **Account management**:

| Data type | Why |
| --- | --- |
| Personal info → Email address | Sign-in |
| Personal info → Name | Shown in the account (from Google sign-in) |
| App activity → Other user-generated content | The user's mantras, prayers, counts and settings, synced to their account |

Collected **and shared** by the Google AdMob SDK (required, not optional), purposes **Advertising or marketing**, **Analytics**, **Fraud prevention, security, and compliance**:

| Data type | Why |
| --- | --- |
| Location → Approximate location | AdMob derives it from the IP address |
| Device or other IDs | Advertising ID |
| App activity → App interactions | Ad views and taps |
| App info and performance → Diagnostics | Ad SDK performance |

Not collected: precise location, contacts, photos (scanned pages are read on the phone and not uploaded), audio (speech is recognised by Android's speech service and not stored or sent to us).

## AdMob

- Publisher ID: `pub-6299138657923728`; `app-ads.txt` is served at https://mantra-jaap-delta.vercel.app/app-ads.txt
  (Play Console → Store settings → **Website** must be `https://mantra-jaap-delta.vercel.app` for AdMob to verify it).
- App ID `ca-app-pub-6299138657923728~8441678861` → `android/app/src/main/res/values/strings.xml` (`admob_app_id`); banner ad unit `ca-app-pub-6299138657923728/4199181521` → `js/config.js` (`ADMOB_BANNER_ID`).
- In AdMob → Privacy & messaging, create a **GDPR (European regulations) message** so the consent form appears in the EEA/UK.

## Closed test (personal developer account)

1. Testing → Closed testing → create a track, upload `japsadhna-play.aab`.
2. Add at least **12 testers** (their Gmail addresses) and share the opt-in link.
3. They must stay opted in for **14 days in a row**.
4. Then Dashboard → **Apply for production** → publish.
