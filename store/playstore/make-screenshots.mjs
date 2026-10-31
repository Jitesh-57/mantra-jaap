// Play Store phone screenshots, 1080 x 1920: title + feature list on the left, the app on the right.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const DIR = '/tmp/claude-0/-home-user/0531e9ce-6ce7-5f71-865c-f1743593a224/scratchpad/promo/';
const data = (f, type = 'image/png') => `data:${type};base64,` + fs.readFileSync(f).toString('base64');
const LOGO = data('/home/user/mantra-jaap/img/icon-512.png');
const shot = (n) => data(DIR + 'raw/' + n + '.png');
const bg = (n) => data(DIR + 'bg/' + n + '.jpg', 'image/jpeg');

const FEATURES_GRID = [['📿', 'Mala Counter'], ['🎙️', 'Voice Counting'], ['📖', 'Live Highlight'], ['🪔', '65+ Aartis & Mantras'], ['🔥', 'Daily Streaks'], ['🖼️', '100+ Wallpapers']];

const SLIDES = [
  { kind: 'hero', theme: 'night', bg: 'shiva', title: 'Your Daily<br><em>Mantra Journey</em>', hindi: 'आपकी दैनिक जप साधना', line: 'Count · Chant · Read · Grow in devotion', shots: ['home', 'mala', 'prayer'] },
  { theme: 'night', bg: 'shiva_temple', shot: 'mala', band: [['108', 'beads per mala'], ['1 tap', 'per mantra'], ['∞', 'malas tracked']],  title: 'Powerful<br><em>Mala Counter</em>', hindi: 'असली रुद्राक्ष माला', features: [
    ['📿', '108 Rudraksha Beads', 'One bead moves with every mantra'],
    ['🔔', 'Bell & Bead Sounds', 'Soft clicks, temple bell on each mala'],
    ['👆', 'Tap or Voice', 'Chant in mind or aloud — your choice'],
    ['🔁', 'Rounds & Totals', 'Malas done, today and all-time'] ] },
  { theme: 'cream', shot: 'voice', band: [['12', 'languages'], ['0 taps', 'fully hands-free'], ['Live', 'word highlight']],  title: 'Chant Aloud,<br><em>We Count</em>', hindi: 'बोलिए, गिनती हम करेंगे', features: [
    ['🎙️', 'Automatic Voice Count', 'Every recitation counted hands-free'],
    ['✨', 'Words Light Up', 'See each word as you speak it'],
    ['🗣️', '12 Indian Languages', 'Hindi, Sanskrit, Marathi & more'],
    ['🔕', 'Do Not Disturb', 'Silence notifications while chanting'] ] },
  { theme: 'night', bg: 'krishna_ghat', shot: 'prayer', band: [['40', 'chaupais, read along'], ['A → A+', 'any text size'], ['3', 'reading modes']],  title: 'Read with<br><em>Live Highlight</em>', hindi: 'पाठ करें, शब्द चमकें', features: [
    ['📖', 'Word-by-Word Follow', 'Never lose your place in long prayers'],
    ['🕉️', 'Beautiful Devanagari', 'Clear fonts, adjustable text size'],
    ['⏱️', 'Steady Pace Mode', 'Guided reading at your own speed'],
    ['🙏', 'Chalisa & Stotras', 'Perfect for Hanuman Chalisa & aartis'] ] },
  { theme: 'cream', shot: 'library', band: [['65+', 'prayers ready'], ['14', 'aartis'], ['10', 'one-tap naam jap']],  title: '65+ Mantras,<br><em>Aartis & Chalisa</em>', hindi: 'मंत्र, आरती और चालीसा', features: [
    ['🪔', 'Ready Prayer Library', 'Om Jai Jagdish, Sukhkarta & more'],
    ['🔎', 'Search Any Language', 'हनुमान, hanuman — both work'],
    ['📸', 'Scan From a Book', 'Add any prayer with your camera'],
    ['⚡', 'One-Tap Naam Jap', 'राधे राधे, राम, ॐ नमः शिवाय'] ] },
  { theme: 'night', bg: 'rk_lotus', shot: 'sankalp', band: [['40', 'day sankalp'], ['Any', 'count you choose'], ['1 tap', 'to continue']],  title: 'Take a<br><em>Sankalp</em>', hindi: 'संकल्प के साथ साधना', features: [
    ['🗓️', 'Day Plans', '7, 21, 40 or 108 days — or any number'],
    ['🔢', 'Any Count', '11, 21, 108, 1008 or your own'],
    ['📍', 'Days Remaining', 'See Day 12 of 40 at a glance'],
    ['▶️', 'Continue in One Tap', 'Saved mantras start instantly'] ] },
  { theme: 'cream', shot: 'stats', band: [['30', 'days of history'], ['Every', 'mantra counted'], ['Free', 'cloud sync']],  title: 'Track Your<br><em>Spiritual Progress</em>', hindi: 'अपनी साधना देखें', features: [
    ['🔥', 'Daily Streak', 'Build the habit, day after day'],
    ['📊', '30-Day History', 'See every day’s jaap at a glance'],
    ['🏆', 'Best Day & Malas', 'Celebrate your milestones'],
    ['☁️', 'Safe in Your Account', 'Sync across phones with Google'] ] },
  { theme: 'night', bg: 'krishna_gold', shot: 'walls', band: [['100+', 'wallpapers'], ['10', 'colour controls'], ['6', 'themes']],  title: '100+ Divine<br><em>Wallpapers</em>', hindi: 'अपने इष्ट देव चुनें', features: [
    ['🖼️', 'Krishna, Shiv, Ram & More', 'Set any picture as your background'],
    ['🎨', 'Every Colour Yours', 'Panels, text, buttons & highlight'],
    ['🪟', 'Frosted Glass Panels', 'Adjust transparency, blur & dim'],
    ['🌙', 'Light & Dark Themes', 'Bhakti, Temple, Midnight & more'] ] },
];

const css = (night) => `
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;position:relative;font-family:Poppins,Mukta,sans-serif;color:${night ? '#fff3e0' : '#2c1608'};
  background:${night ? '#120804' : 'radial-gradient(110% 60% at 30% 0%, #fffaf2 0%, #ffeccd 55%, #ffd89c 100%)'}}
.photo{position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(.42) saturate(1.15) blur(3px);transform:scale(1.06)}
.shade{position:absolute;inset:0;background:${night ? 'linear-gradient(90deg, rgba(18,6,2,.92) 0%, rgba(18,6,2,.70) 45%, rgba(18,6,2,.25) 100%), linear-gradient(0deg, rgba(18,6,2,.9) 0%, transparent 30%)' : 'none'}}
.mandala{position:absolute;width:1300px;height:1300px;left:-420px;top:-380px;opacity:${night ? .10 : .20}}
.temple{position:absolute;left:0;right:0;bottom:0;height:520px;opacity:${night ? .0 : .22}}
.glow{position:absolute;width:820px;height:820px;right:-220px;top:520px;border-radius:50%;background:radial-gradient(circle, rgba(255,160,40,${night ? .35 : .45}), transparent 65%);filter:blur(20px)}
.brand{position:absolute;left:56px;top:64px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:30px}
.brand img{width:64px;height:64px;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.25)}
.brand small{display:block;font-family:Mukta;font-size:22px;font-weight:600;color:${night ? '#ffc56b' : '#e2621a'}}
.col{position:absolute;left:52px;top:210px;width:430px}
h1{font-family:'Playfair Display',serif;font-size:78px;line-height:1.02;font-weight:800;letter-spacing:-.01em}
h1 em{font-style:normal;display:inline-block;background:${night ? 'linear-gradient(180deg,#ffe29a,#ffb02e 55%,#f27a12)' : 'linear-gradient(180deg,#ff8a1f,#e2541b)'};-webkit-background-clip:text;background-clip:text;color:transparent}
.hindi{margin-top:18px;font-family:'Tiro Devanagari Hindi',Mukta,serif;font-size:36px;color:${night ? '#ffd28a' : '#a2400f'}}
.rule{margin:30px 0 46px;height:3px;width:120px;border-radius:2px;background:linear-gradient(90deg,#ffb02e,transparent)}
.feat{display:flex;gap:18px;align-items:flex-start;margin-bottom:64px}
.feat .ic{flex:none;width:86px;height:86px;border-radius:24px;display:grid;place-items:center;font-size:42px;
  background:${night ? 'linear-gradient(145deg,rgba(255,190,90,.22),rgba(255,140,30,.10))' : '#fff'};border:1.5px solid ${night ? 'rgba(255,200,120,.45)' : 'rgba(226,84,27,.25)'};box-shadow:0 8px 20px rgba(0,0,0,${night ? .25 : .08})}
.feat b{display:block;font-size:32px;line-height:1.2;font-weight:700;color:${night ? '#ffe7bf' : '#2c1608'}}
.feat span{display:block;margin-top:6px;font-size:25px;line-height:1.35;color:${night ? '#e9cfae' : '#7a5236'};font-family:Poppins,Mukta}
.phone{position:absolute;padding:16px;border-radius:78px;background:linear-gradient(145deg,#3a3a3a,#0b0b0b);box-shadow:0 40px 90px rgba(0,0,0,.55), 0 0 0 2px rgba(255,210,140,.25), inset 0 0 0 3px #444}
.phone img{display:block;width:100%;border-radius:62px}
.phone .notch{position:absolute;top:30px;left:50%;transform:translateX(-50%);width:110px;height:32px;border-radius:18px;background:#0b0b0b}
.band{position:absolute;left:52px;right:52px;bottom:190px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.band div{padding:24px 10px 22px;border-radius:28px;text-align:center;background:${night ? 'rgba(255,190,90,.12)' : 'rgba(255,255,255,.75)'};border:1.5px solid ${night ? 'rgba(255,200,120,.35)' : 'rgba(226,84,27,.22)'};box-shadow:0 10px 26px rgba(0,0,0,.12)}
.band b{display:block;font-family:'Playfair Display',serif;font-size:58px;line-height:1;font-weight:800;background:linear-gradient(180deg,#ffcf6b,#f26b0f);-webkit-background-clip:text;background-clip:text;color:transparent}
.band span{display:block;margin-top:10px;font-size:24px;font-weight:600;color:${night ? '#f3dcbb' : '#7a5236'}}
.cta{position:absolute;left:50%;transform:translateX(-50%);bottom:72px;white-space:nowrap;padding:24px 46px;border-radius:999px;font-size:34px;font-weight:700;color:#fff;
  background:linear-gradient(90deg,#f26b0f,#ff9a1f);box-shadow:0 14px 34px rgba(242,107,15,.45), inset 0 0 0 2px rgba(255,255,255,.25)}
.cta small{font-weight:600;opacity:.92}
`;
const mandala = (c) => `<svg class="mandala" viewBox="-100 -100 200 200"><g fill="none" stroke="${c}" stroke-width=".4">
${Array.from({ length: 24 }, (_, k) => `<ellipse rx="16" ry="60" transform="rotate(${k * 15})"/>`).join('')}
${[18, 32, 46, 70, 90].map((r) => `<circle r="${r}"/>`).join('')}
${Array.from({ length: 48 }, (_, k) => `<circle r="2" cx="${(80 * Math.cos(k * Math.PI / 24)).toFixed(2)}" cy="${(80 * Math.sin(k * Math.PI / 24)).toFixed(2)}"/>`).join('')}</g></svg>`;
// a row of temple shikharas for the cream slides
const temple = `<svg class="temple" viewBox="0 0 1080 520" preserveAspectRatio="none"><g fill="#c2541b">
<path d="M0 520V420h60v-40l40-80 40 80v40h40v100z"/><path d="M180 520V360h40l70-180 70 180h40v160z"/>
<path d="M420 520V300h50l70-220 70 220h50v220z"/><path d="M700 520V380h40l60-150 60 150h40v140z"/><path d="M940 520V410h40l50-110 50 110v110z"/>
<circle cx="540" cy="70" r="10"/><rect x="537" y="20" width="6" height="45"/></g></svg>`;
const head = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@500;600;700&family=Mukta:wght@500;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">`;
const brand = `<div class="brand"><img src="${LOGO}"><div>JapSadhna<small>जपसाधना · Mala Jaap Counter</small></div></div>`;
const cta = `<div class="cta">🙏 Start your jaap today <small>· Free</small></div>`;

function slide(s) {
  const night = s.theme === 'night';
  const back = (s.bg ? `<div class="photo" style="background-image:url('${bg(s.bg)}')"></div><div class="shade"></div>` : '') + mandala(night ? '#ffc56b' : '#e2621a') + temple + '<div class="glow"></div>';
  if (s.kind === 'hero') {
    const phone = (n, x, y, w, rot, z) => `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);z-index:${z}"><img src="${shot(n)}"></div>`;
    return `${head}<style>${css(true)}
      .hero{position:absolute;top:190px;left:0;right:0;text-align:center}
      .hero h1{font-size:96px}.hero .hindi{font-size:40px}.hero .line{margin-top:16px;font-size:30px;color:#f1d8b6}
      .grid{position:absolute;left:56px;right:56px;bottom:190px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      .grid div{display:flex;flex-direction:column;align-items:center;gap:8px;padding:22px 10px;border-radius:26px;background:rgba(255,190,90,.12);border:1.5px solid rgba(255,200,120,.35);font-size:25px;font-weight:700;color:#ffe7bf;text-align:center}
      .grid i{font-style:normal;font-size:46px}
      .shade{background:linear-gradient(0deg, rgba(18,6,2,.95) 0%, rgba(18,6,2,.55) 40%, rgba(18,6,2,.75) 100%)}
    </style></head><body>${back}${brand}
      <div class="hero"><h1>${s.title}</h1><div class="hindi">${s.hindi}</div><div class="line">${s.line}</div></div>
      ${phone(s.shots[1], 40, 610, 330, -8, 1)}${phone(s.shots[2], 710, 610, 330, 8, 1)}${phone(s.shots[0], 345, 560, 390, 0, 2)}
      <div class="grid">${FEATURES_GRID.map(([i, t]) => `<div><i>${i}</i>${t}</div>`).join('')}</div>${cta}</body></html>`;
  }
  return `${head}<style>${css(night)}</style></head><body>${back}${brand}
    <div class="col"><h1>${s.title}</h1><div class="hindi">${s.hindi}</div><div class="rule"></div>
    ${s.features.map(([i, t, d]) => `<div class="feat"><div class="ic">${i}</div><div><b>${t}</b><span>${d}</span></div></div>`).join('')}</div>
    <div class="phone" style="left:494px;top:220px;width:566px"><img src="${shot(s.shot)}"></div>
    <div class="band">${s.band.map(([n, t]) => `<div><b>${n}</b><span>${t}</span></div>`).join('')}</div>${cta}</body></html>`;
}

fs.mkdirSync(DIR + 'out2', { recursive: true });
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [i, s] of SLIDES.entries()) {
  fs.writeFileSync(DIR + 'slide2.html', slide(s));
  await page.goto('file://' + DIR + 'slide2.html'); await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  const name = `${String(i + 1).padStart(2, '0')}_${s.shot || 'overview'}.png`;
  await page.screenshot({ path: DIR + 'out2/' + name }); console.log('made', name);
}
await b.close();
