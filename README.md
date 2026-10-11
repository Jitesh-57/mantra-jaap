# Mantra Jaap

A mantra jaap counter and prayer reader that runs entirely in the browser.

- **Auto counting**: chant aloud and the microphone counts each mantra (voice followed by a short pause).
- **Tap counting**: chant in your mind and tap once per mantra.
- **Live word highlighting** while you read:
  - *Follow voice*: speech recognition lights up each word as you say it; in auto mode each finished recitation counts one.
  - *Steady pace*: words light up at an adjustable speed.
  - Tap any word to move the highlight there.
- **Prayer from a photo**: take or upload a photo, drag to select the text, extract it with on-device OCR (Tesseract.js), edit, and save it as a prayer.
- **Settings** (⚙ bottom-right): app language (English / हिन्दी / मराठी), prayer language for voice and OCR (13 Indian languages), themes, screen/text/highlight colours, wallpapers (presets or your own photo), text size.
- Save your own mantras and prayers and set any count; share a link that opens with your mantra: `/?m=<text>&n=<count>&t=<title>`.

Counts, saved prayers and settings stay on each person's own device (localStorage).

## Deploy

Static site with no build step. On Vercel: **Add New → Project → Import** this repo → **Deploy** (Framework preset: *Other*).
Pushing to `main` updates production.
