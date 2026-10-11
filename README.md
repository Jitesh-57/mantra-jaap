# Mantra Jaap

A mantra jaap counter and prayer reader that runs entirely in the browser.

- **Auto counting**: chant aloud and the microphone counts each mantra (voice followed by a short pause).
- **Tap counting**: chant in your mind and tap once per mantra.
- **Live word highlighting** while you read:
  - *Follow voice*: speech recognition lights up each word as you say it. Heard words are matched by sound (so कृष्ण, क्रिष्ण and "krishna" agree) and aligned as a sequence, so a single mis-heard word cannot make the highlight jump. In auto mode each finished recitation counts one.
  - *Steady pace*: words light up at an adjustable speed.
  - Tap any word to move the highlight there.
- **Prayer from a photo**: take or upload a photo, drag to select the text, extract it with on-device OCR (Tesseract.js), edit, and save it as a prayer.
- **Settings** (⚙ bottom-right): app language (English / हिन्दी / मराठी), prayer language for voice and OCR (13 Indian languages), themes, screen/text/highlight colours, wallpapers (presets or your own photo), text size.
- Save your own mantras and prayers and set any count; share a link that opens with your mantra: `/?m=<text>&n=<count>&t=<title>`.

Counts, saved prayers and settings stay on each person's own device (localStorage).

## Code layout

- `index.html` – markup and icon sprite
- `css/app.css` – design tokens and components (themes are applied from JS)
- `js/app.js` – screens, counting, voice, scanning, settings
- `js/align.js` – follow-voice engine: phonetic word keys + alignment of the heard words against the text
- `js/i18n.js` – English, Hindi and Marathi strings
- `js/cloud.js`, `js/config.js`, `supabase/schema.sql` – optional accounts (Google / email) via Supabase; see `SETUP-ACCOUNTS.md`

## Deploy

Static site with no build step. On Vercel: **Add New → Project → Import** this repo → **Deploy** (Framework preset: *Other*).
Pushing to `main` updates production.
