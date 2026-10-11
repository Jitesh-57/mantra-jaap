# Mantra Jaap

A simple mantra jaap counter that runs entirely in the browser.

- **Auto counting**: chant aloud and the microphone counts each mantra (voice followed by a short pause).
- **Tap counting**: chant in your mind and tap once per mantra.
- Save your own mantras and set any count (11, 21, 27, 54, 108, 1008 or custom).
- Share a link that opens with your mantra and count: `/?m=<mantra>&n=<count>`.

Counts and saved mantras are kept on each person's own device (localStorage).

## Deploy

Static site with no build step. On Vercel: **Add New → Project → Import** this repo → **Deploy** (Framework preset: *Other*).
