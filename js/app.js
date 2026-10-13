import { STRINGS } from './i18n.js';
import { createTracker, wordKey, similarity } from './align.js';
import { LIBRARY } from './library.js';
import { listWallpapers, wallUrl } from './wallpapers.js';
import { googleSearchUrl } from './online.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMOB_BANNER_ID } from './config.js';
import { connect } from './cloud.js';
import { NATIVE, WEB_URL, AUTH_CALLBACK, startNativeSpeech, nativeShare, onBackButton, exitApp, onAppLink, openExternal, closeExternal, nativeKeepAwake, initAds, setAdVisible, adPrivacyNeeded, showAdPrivacy } from './native.js';

// ============ constants ============
const KEY = 'mantra-jaap-v3';
const SET_KEY = 'mantra-jaap-settings';
const WP_KEY = 'mantra-jaap-wallpaper';
const SIGNED_KEY = 'mantra-jaap-signed-in';
// accounts are on once js/config.js is filled in; without them nothing changes
const AUTH_ON = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
let cloud = null; // Supabase connection, once loaded
let user = null;  // signed-in user, or null for guests
const PRESETS = [1, 11, 21, 27, 54, 108, 1008];
const TESS = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/';
const TESS_CORE = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1';
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const HAS_SR = !!SR || NATIVE; // the Android app uses the phone's own speech recogniser
const ANDROID = /Android/i.test(navigator.userAgent);

const LANGS = {
  hi: { name: 'हिन्दी', sr: 'hi-IN', ocr: 'hin', deva: true },
  sa: { name: 'संस्कृत', sr: 'hi-IN', ocr: 'san+hin', deva: true },
  mr: { name: 'मराठी', sr: 'mr-IN', ocr: 'mar', deva: true },
  ne: { name: 'नेपाली', sr: 'ne-NP', ocr: 'nep', deva: true },
  en: { name: 'English', sr: 'en-IN', ocr: 'eng' },
  gu: { name: 'ગુજરાતી', sr: 'gu-IN', ocr: 'guj' },
  pa: { name: 'ਪੰਜਾਬੀ', sr: 'pa-IN', ocr: 'pan' },
  bn: { name: 'বাংলা', sr: 'bn-IN', ocr: 'ben' },
  or: { name: 'ଓଡ଼ିଆ', sr: 'or-IN', ocr: 'ori' },
  ta: { name: 'தமிழ்', sr: 'ta-IN', ocr: 'tam' },
  te: { name: 'తెలుగు', sr: 'te-IN', ocr: 'tel' },
  kn: { name: 'ಕನ್ನಡ', sr: 'kn-IN', ocr: 'kan' },
  ml: { name: 'മലയാളം', sr: 'ml-IN', ocr: 'mal' },
};

const THEMES = {
  bhakti:   { name: 'thBhakti',   bg: '#fff6ea', surface: '#ffffff', surface2: '#fdebd6', line: '#f0d9bd', text: '#3b2312', text2: '#8a6a4f', accent: '#f26b0f', accentInk: '#ffffff', gold: '#ffb02e', light: true },
  saffron:  { name: 'thSaffron',  bg: '#140c07', surface: '#1f150e', surface2: '#2a1d13', line: '#3a2a1c', text: '#f7ebdc', text2: '#b89f84', accent: '#f08a24', accentInk: '#1a0f08', gold: '#f2c14e' },
  temple:   { name: 'thTemple',   bg: '#faf5ec', surface: '#ffffff', surface2: '#f3e9d8', line: '#e6d8c0', text: '#2b1d10', text2: '#7d6650', accent: '#c2410c', accentInk: '#ffffff', gold: '#f5b83d', light: true },
  midnight: { name: 'thMidnight', bg: '#0a0e1a', surface: '#121829', surface2: '#1a2238', line: '#263150', text: '#e6eaf5', text2: '#8f9bbd', accent: '#6d8dff', accentInk: '#ffffff', gold: '#f5c76a' },
  lotus:    { name: 'thLotus',    bg: '#170b14', surface: '#22121d', surface2: '#2e1828', line: '#432539', text: '#fbe9f3', text2: '#c99bb6', accent: '#ec6fa8', accentInk: '#1d0a15', gold: '#f7c6dd' },
  forest:   { name: 'thForest',   bg: '#0b140e', surface: '#122017', surface2: '#1a2c20', line: '#264030', text: '#e3f1e6', text2: '#8fb59a', accent: '#4fbf7a', accentInk: '#06140b', gold: '#e3cf6a' },
};
const omTile = 'url("data:image/svg+xml,' + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><text x='60' y='76' font-size='46' text-anchor='middle' fill='#f08a24' fill-opacity='0.2' font-family='serif'>ॐ</text></svg>") + '")';
const WALLPAPERS = {
  none: { name: 'wpNone' },
  sunrise: { name: 'wpSunrise', css: 'linear-gradient(170deg, #4a1606 0%, #a8410d 40%, #e89a3c 62%, #1c0c05 100%)' },
  om: { name: 'wpOm', css: omTile, tile: true },
  lotus: { name: 'wpLotus', css: 'radial-gradient(circle at 18% 12%, #e0609d 0, transparent 42%), radial-gradient(circle at 88% 82%, #7a45e0 0, transparent 46%), linear-gradient(160deg, #340d28, #12071c)' },
  stars: { name: 'wpStars', css: 'radial-gradient(1.5px 1.5px at 20% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 70% 22%, #fff 50%, transparent), radial-gradient(1.2px 1.2px at 42% 68%, #fff 50%, transparent), radial-gradient(1px 1px at 84% 58%, #fff 50%, transparent), radial-gradient(1.5px 1.5px at 60% 88%, #fff 50%, transparent), radial-gradient(1px 1px at 10% 80%, #fff 50%, transparent), radial-gradient(ellipse at 50% 0%, #1c2a5a, #05070f 70%)' },
};

// ============ helpers ============
const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const todayKey = () => new Date().toLocaleDateString('en-CA');
const uid = () => Math.random().toString(36).slice(2, 10);
// A mantra gets the mala-ring screen; only real prayers (many words or lines) get the reading screen.
// Line breaks alone don't count: a short mantra is often typed or scanned on two or three lines.
const isLong = (text) => {
  const words = text.trim().split(/\s+/).filter((w) => /[\p{L}]/u.test(w)).length; // ignore । ॥ and verse numbers
  const lines = text.trim().split(/\n/).filter((l) => l.trim()).length;
  return words > 16 || lines >= 4;
};
const clampCount = (v, d = 108) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 1 ? Math.min(n, 100000) : d; };
const icon = (name, cls = 'i') => `<svg class="${cls}"><use href="#i-${name}"/></svg>`;

function store(key, value) { try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); return true; } catch (e) { return false; } }
function read(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }

// ============ state ============
function freshState() {
  return { items: [], currentId: null, libOpen: true, day: todayKey(), todayCount: 0, total: 0, gap: 0.7, sens: 5, minLen: 1.2, wpm: 60, guide: 'voice', hist: {} };
}
function newItem(text, title = '', target) {
  return { id: uid(), title, text, target: target || (isLong(text) ? 1 : 108), count: 0, rounds: 0, updated: Date.now() };
}
function loadState() {
  const saved = read(KEY);
  if (saved && Array.isArray(saved.items)) return { ...freshState(), ...saved };
  // migrate the earlier single-page version
  const st = freshState();
  const v2 = read('mantra-jaap-v2'), v1 = read('mantra-jaap-v1');
  if (v2) {
    (v2.saved || []).forEach((s) => s && s.text && st.items.push({ ...newItem(s.text, s.title || '', s.target), updated: 0 }));
    if (v2.mantra) {
      let it = st.items.find((i) => i.text === v2.mantra);
      if (!it) { it = newItem(v2.mantra, v2.title || '', v2.target); st.items.unshift(it); }
      Object.assign(it, { count: v2.count || 0, rounds: v2.rounds || 0, target: v2.target || it.target, updated: Date.now() });
      st.currentId = it.id;
    }
    for (const k of ['day', 'todayCount', 'total', 'gap', 'sens', 'minLen', 'wpm']) if (v2[k] != null) st[k] = v2[k];
    if (v2.savedOpen === false) st.libOpen = false;
  } else if (v1) st.total = v1.total || 0;
  return st;
}
const st = loadState();
if (st.day !== todayKey()) { st.day = todayKey(); st.todayCount = 0; }
const save = () => { store(KEY, st); queueCloudSave(); };

const DEFAULT_SETTINGS = { uiLang: '', voiceLang: 'hi', theme: 'bhakti', bg: '', text: '', hl: '', wallpaper: 'none', dim: 0.2, ts: 26, font: 'classic', sound: true, vibe: true, cardT: 0.4, cardBlur: 14 };
// Settings are kept only for signed-in people; guests start from the defaults each visit.
const keepSettings = () => !AUTH_ON || !!read(SIGNED_KEY);
const S = { ...DEFAULT_SETTINGS, ...(keepSettings() ? read(SET_KEY) || {} : {}) };
if (S.ink && !S.text) S.text = S.ink;
delete S.ink;
if (!STRINGS[S.uiLang]) { const l = (navigator.language || '').slice(0, 2); S.uiLang = STRINGS[l] ? l : 'en'; }
if (!LANGS[S.voiceLang]) S.voiceLang = 'hi';
if (!THEMES[S.theme]) S.theme = 'bhakti';
if (S.dim === 0.5) S.dim = 0.2; // earlier default hid wallpapers too much
let wpData = null;
if (keepSettings()) { try { wpData = localStorage.getItem(WP_KEY); } catch (e) {} }
// Changes apply straight away but are only kept when "Save settings" is pressed.
let savedSnapshot = '';
const settingsSnapshot = () => JSON.stringify([S, S.wallpaper === 'custom' ? wpData : null]);
const settingsDirty = () => settingsSnapshot() !== savedSnapshot;
function saveSettings() {
  const dirty = settingsDirty();
  const b = $('setSave');
  b.classList.toggle('dirty', dirty);
  b.querySelector('span').textContent = t('saveSettings');
}

const itemById = (id) => st.items.find((i) => i.id === id);
const currentItem = () => itemById(st.currentId);

// "Jaap today" and "All-time" belong to each mantra, so resetting one leaves the others alone
const itemToday = (it) => (it.todayDay === todayKey() ? it.todayN || 0 : 0);
const todayAll = () => st.items.reduce((n, it) => n + itemToday(it), 0);
if (!st.items.some((i) => 'total' in i)) {
  // earlier versions kept one shared tally; give it to the mantra in use
  const c = currentItem() || st.items[0];
  if (c) { c.total = st.total || 0; if (st.day === todayKey()) { c.todayN = st.todayCount || 0; c.todayDay = st.day; } }
}
// day-by-day history started later: begin it with what was counted today
st.hist ||= {};
if (!(todayKey() in st.hist) && todayAll()) st.hist[todayKey()] = todayAll();

// ============ i18n ============
function t(k, vars) {
  let s = STRINGS[S.uiLang]?.[k] ?? STRINGS.en[k] ?? k;
  if (vars) for (const v in vars) s = s.replaceAll('{' + v + '}', vars[v]);
  return s;
}
function applyI18n() {
  document.documentElement.lang = S.uiLang;
  $$('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
  $$('[data-t-ph]').forEach((el) => { el.placeholder = t(el.dataset.tPh); });
  $$('[data-t-label]').forEach((el) => { const v = t(el.dataset.tLabel); el.setAttribute('aria-label', v); el.title = v; });
  renderHome();
  if (!$('practice').hidden) refreshPractice();
  if (!$('setSheet').hidden) renderSettings();
  if (!$('startSheet').hidden) renderStart();
  if (!$('libSheet').hidden) renderLibrary();
  renderTuneLabels();
  renderAccount();
}

// ============ toast / sound ============
let toastTimer;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.remove('off');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('off'), 2800);
}
let actx;
const vibrate = (p) => { if (S.vibe === false) return; try { navigator.vibrate?.(p); } catch (e) {} };
const audio = () => (actx = actx || new (window.AudioContext || window.webkitAudioContext)());
// the soft knock of one rudraksha bead against the next
function beadClick() {
  if (S.sound === false) return;
  try {
    const a = audio(), now = a.currentTime;
    const len = Math.floor(a.sampleRate * 0.05), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    const src = a.createBufferSource(); src.buffer = buf;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 3.5;
    const g = a.createGain(); g.gain.value = 0.55;
    src.connect(bp).connect(g).connect(a.destination); src.start(now);
    const o = a.createOscillator(), og = a.createGain();
    o.frequency.setValueAtTime(320, now); o.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    og.gain.setValueAtTime(0.12, now); og.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    o.connect(og).connect(a.destination); o.start(now); o.stop(now + 0.09);
  } catch (e) {}
}
// a temple bell when a mala is complete
function bell() {
  if (S.sound === false) return;
  try {
    const a = audio(), now = a.currentTime;
    [[1, 0.2, 4], [2.76, 0.09, 2.6], [5.4, 0.05, 1.6], [8.93, 0.025, 1]].forEach(([m, v, dur]) => {
      const o = a.createOscillator(), g = a.createGain();
      o.frequency.value = 392 * m;
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(v, now + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g).connect(a.destination); o.start(now); o.stop(now + dur);
    });
  } catch (e) {}
}

// ============ my sadhana: jaap per day ============
const dayKey = (d) => d.toLocaleDateString('en-CA');
const histDay = (k) => st.hist?.[k] || 0;
function addHist(n) {
  st.hist ||= {};
  const k = todayKey();
  st.hist[k] = Math.max(0, (st.hist[k] || 0) + n);
}
function streak() {
  const d = new Date();
  if (!histDay(dayKey(d))) d.setDate(d.getDate() - 1); // today not started yet: the streak is still alive
  let n = 0;
  while (histDay(dayKey(d)) > 0) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function lastDays(n) {
  const out = [];
  const d = new Date(); d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) { out.push({ key: dayKey(d), date: new Date(d), n: histDay(dayKey(d)) }); d.setDate(d.getDate() + 1); }
  return out;
}

// ============ theme ============
function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function applyTheme() {
  const th = THEMES[S.theme];
  const root = document.documentElement;
  const set = (k, v) => root.style.setProperty(k, v);
  const bg = S.bg || th.bg;
  const light = luminance(bg) > 0.4;
  set('--bg', bg);
  // panel colour: cards and panels; their text flips light/dark when the panel needs it
  const panel = S.panel || th.surface;
  const panelLight = luminance(panel) > 0.4;
  const edge = panelLight ? '#000' : '#fff';
  set('--surface', panel);
  set('--surface-2', S.panel ? `color-mix(in srgb, ${panel} 90%, ${edge})` : th.surface2);
  set('--line', S.panel ? `color-mix(in srgb, ${panel} 82%, ${edge})` : th.line);
  const flip = S.panel && panelLight !== !!th.light;
  const pText = flip ? (panelLight ? '#2b1d10' : '#f7ebdc') : th.text;
  set('--text', pText); set('--text-2', flip ? (panelLight ? '#7d6650' : '#c7ae92') : th.text2);
  set('--accent', th.accent); set('--accent-ink', th.accentInk); set('--gold', th.gold);
  set('--read', S.text || pText);
  // text that sits straight on the background (titles, header, hints) follows the chosen text colour too
  set('--on-bg', S.text ? `color-mix(in srgb, ${S.text} 85%, transparent)` : th.text2);
  set('--on-bg-strong', S.text || th.text);
  // titles inside the home panels: the chosen text colour, else the panel's own soft text
  set('--sec-title', S.text ? S.text : flip ? (panelLight ? '#7d6650' : '#c7ae92') : th.text2);
  const hl = S.hl || th.gold;
  set('--hl', hl); set('--hl-ink', luminance(hl) > 0.3 ? '#1a0f08' : '#ffffff');
  set('--ts', S.ts + 'px');
  // over a wallpaper: how see-through and how frosted the panels are
  set('--card-a', Math.round((1 - (S.cardT ?? 0.4)) * 100) + '%');
  set('--card-blur', (S.cardBlur ?? 14) + 'px');
  root.toggleAttribute('data-light', S.panel ? panelLight : !!th.light); // panels decide light or dark controls
  root.dataset.font = S.font;
  document.querySelector('meta[name=theme-color]').content = bg;

  const wp = S.wallpaper === 'custom' && wpData ? { css: `url("${wpData}")` } : S.wallpaper.startsWith('gal:') ? galleryWp(S.wallpaper.slice(4)) : WALLPAPERS[S.wallpaper];
  const body = document.body.style;
  if (!wp || !wp.css) {
    body.backgroundImage = `radial-gradient(120% 55% at 50% -12%, color-mix(in srgb, ${th.accent} ${light ? 10 : 15}%, transparent), transparent 62%)`;
    body.backgroundSize = ''; body.backgroundRepeat = 'no-repeat';
  } else {
    const d = light ? `rgb(250 245 236 / ${S.dim})` : `rgb(0 0 0 / ${S.dim})`;
    body.backgroundImage = `linear-gradient(${d}, ${d}), ${wp.css}`;
    body.backgroundSize = wp.tile ? 'auto, 120px 120px' : 'cover';
    body.backgroundRepeat = wp.tile ? 'repeat' : 'no-repeat';
  }
  document.body.classList.toggle('has-wp', !!(wp && wp.css));
}

// ============ ads (Android app only) ============
// One banner at the bottom of the home screen; never while chanting or while a panel is open.
let adHeight = 0;
function syncAds() {
  if (!NATIVE) return;
  const on = !$('home').hidden && !openSheets.length;
  setAdVisible(on);
  document.documentElement.style.setProperty('--ad-h', (on ? adHeight : 0) + 'px');
}

// ============ sheets ============
const openSheets = [];
let lastFocus = null;
function openSheet(id) {
  const el = $(id);
  if (!el.hidden) return;
  lastFocus = document.activeElement;
  el.hidden = false;
  openSheets.push(el);
  el.style.zIndex = 50 + openSheets.length; // a panel opened from another one sits on top of it
  document.body.classList.add('locked');
  const panel = el.querySelector('.sheet-panel'); if (panel) panel.scrollTop = 0;
  syncAds();
}
function closeSheet(el) {
  if (typeof el === 'string') el = $(el);
  if (!el || el.hidden) return;
  el.hidden = true;
  openSheets.splice(openSheets.indexOf(el), 1);
  if (el.id === 'setSheet') { document.body.classList.remove('peek'); if (settingsDirty()) toast(t('notSaved')); }
  if (!openSheets.length) document.body.classList.remove('locked');
  lastFocus?.focus?.({ preventScroll: true });
  syncAds();
}
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-close]');
  if (c) closeSheet(c.closest('.sheet'));
  else if (e.target.classList?.contains('sheet')) closeSheet(e.target);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openSheets.length) closeSheet(openSheets[openSheets.length - 1]);
});

// ============ home ============
function renderHome() {
  const today = todayAll();
  $('todayLine').textContent = today ? t('todayLine', { n: today }) : t('todayNone');
  const cur = currentItem();
  $('hero').hidden = !cur;
  if (cur) {
    $('heroTitle').textContent = cur.title;
    $('heroTitle').hidden = !cur.title;
    $('heroText').textContent = cur.text;
    $('heroBar').style.width = Math.round((cur.count / cur.target) * 100) + '%';
    $('heroMeta').textContent = t('progressMeta', { c: cur.count, t: cur.target, r: cur.rounds });
    $('heroToday').textContent = isLong(cur.text) ? t('kindPrayer') : t('kindMantra');
    renderPlanPill($('heroPlan'), cur, true);
  }
  const list = $('list');
  list.textContent = '';
  $('libCount').textContent = st.items.length;
  if (!st.items.length) {
    const p = document.createElement('div');
    p.className = 'empty'; p.textContent = t('emptyLib');
    list.append(p);
  }
  [...st.items].sort((a, b) => (b.updated || 0) - (a.updated || 0)).forEach((it) => {
    const long = isLong(it.text);
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `<button class="item-main"><span class="item-icon">${long ? icon('book') : 'ॐ'}</span><span class="item-text"><b></b><small></small></span></button>
      <button class="icon-btn" data-act="edit">${icon('pen', 'i i-sm')}</button>
      <button class="icon-btn" data-act="del">${icon('trash', 'i i-sm')}</button>`;
    row.querySelector('b').textContent = it.title || it.text.replace(/\s+/g, ' ');
    const pi = planInfo(it);
    row.querySelector('small').textContent = `${long ? t('kindPrayer') : t('kindMantra')} · ${t('timesN', { n: it.target })}` +
      (pi ? ' · ' + (pi.over ? t('planDone', { n: pi.n }) : t('dayOf', { d: pi.day, n: pi.n })) : '');
    const [edit, del] = row.querySelectorAll('[data-act]');
    edit.setAttribute('aria-label', t('edit')); edit.title = t('edit');
    del.setAttribute('aria-label', t('delete')); del.title = t('delete');
    row.querySelector('.item-main').onclick = () => openStart(it);
    edit.onclick = () => openEditor(it);
    del.onclick = () => {
      const name = it.title || it.text.slice(0, 40);
      if (!confirm(t('deleteConfirm', { name }))) return;
      st.items.splice(st.items.indexOf(it), 1);
      if (st.currentId === it.id) st.currentId = null;
      save(); renderHome();
    };
    list.append(row);
  });
  setLib(st.libOpen !== false);
  renderSadhana();
  renderNaam();
}

// ----- my sadhana card and sheet -----
const weekday = (d) => d.toLocaleDateString(LOCALE(), { weekday: 'narrow' });
const LOCALE = () => ({ hi: 'hi-IN', mr: 'mr-IN' })[document.documentElement.lang] || 'en-IN';
function bars(box, days, labels) {
  box.textContent = '';
  const max = Math.max(1, ...days.map((d) => d.n));
  for (const d of days) {
    const col = document.createElement('div');
    col.className = 'day' + (d.key === todayKey() ? ' today' : '') + (d.n ? '' : ' zero');
    col.title = `${d.date.toLocaleDateString(LOCALE(), { day: 'numeric', month: 'short' })}: ${d.n}`;
    col.innerHTML = `<i style="--h:${Math.max(d.n ? 8 : 3, Math.round((d.n / max) * 100))}%"></i>` + (labels ? `<small>${labels(d)}</small>` : '');
    box.append(col);
  }
}
function renderSadhana() {
  const s = streak();
  $('sadStreak').textContent = s;
  $('sadStreakLbl').textContent = t('dayStreak', { n: s });
  $('sadToday').textContent = histDay(todayKey());
  const week = lastDays(7);
  bars($('sadWeek'), week, (d) => weekday(d.date));
  $('sadhana').classList.toggle('empty', !week.some((d) => d.n));
}
function openStats() {
  const days = lastDays(30);
  const all = Object.values(st.hist || {});
  const total = st.items.reduce((n, it) => n + (it.total || 0), 0);
  const rounds = st.items.reduce((n, it) => n + (it.rounds || 0), 0);
  const cells = [
    ['🔥', streak(), t('streakDays')],
    ['📿', total, t('allTime')],
    ['🌼', rounds, t('malasDone')],
    ['🗓️', all.filter((n) => n > 0).length, t('daysPracticed')],
    ['⭐', Math.max(0, ...all), t('bestDay')],
    ['☀️', histDay(todayKey()), t('jaapToday')],
  ];
  $('statGrid').innerHTML = cells.map(([e, n, l]) => `<div><span aria-hidden="true">${e}</span><b>${n}</b><small>${l}</small></div>`).join('');
  bars($('statMonth'), days, (d) => (d.date.getDate() % 5 === 1 || d.key === todayKey() ? d.date.getDate() : ''));
  const box = $('statMantras');
  box.textContent = '';
  const top = [...st.items].filter((it) => it.total).sort((a, b) => b.total - a.total).slice(0, 8);
  const most = top[0]?.total || 1;
  for (const it of top) {
    const row = document.createElement('div');
    row.className = 'bm';
    row.innerHTML = '<span></span><b></b><i></i>';
    row.querySelector('span').textContent = it.title || it.text.replace(/\s+/g, ' ');
    row.querySelector('b').textContent = it.total;
    row.querySelector('i').style.width = Math.round((it.total / most) * 100) + '%';
    box.append(row);
  }
  if (!top.length) box.innerHTML = `<p class="note">${t('noJaapYet')}</p>`;
  openSheet('statsSheet');
}
$('sadhana').onclick = openStats;
$('sadhana').onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStats(); } };

// ----- wallpaper gallery (top of Settings) -----
const galleryWp = (name) => ({ css: `url("${wallUrl(name)}")` });
const isNewPic = (w) => w.added && Date.now() - new Date(w.added).getTime() < 30 * 864e5;
function thumb(w, cls) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls;
  const img = new Image();
  img.loading = 'lazy'; img.decoding = 'async'; img.alt = w.name.replace(/\.[^.]+$/, '');
  img.onload = () => b.classList.add('ready');
  img.src = w.url;
  b.append(img);
  if (S.wallpaper === 'gal:' + w.name) b.classList.add('on');
  b.onclick = () => openWall(w);
  return b;
}
// the card at the top of Settings: the newest pictures
async function renderWallCard() {
  const strip = $('wallStrip');
  try {
    const list = await listWallpapers();
    strip.textContent = '';
    list.slice(0, 4).forEach((w) => strip.append(thumb(w, 'wall-mini')));
    $('wallCount').textContent = list.length ? t('wallCount', { n: list.length }) : '';
  } catch (e) { console.error(e); }
}
async function openWalls() {
  openSheet('wallSheet');
  const grid = $('wallGrid'), note = $('wallNote');
  grid.textContent = '';
  note.hidden = false; note.className = 'note'; note.textContent = t('loadingWalls');
  try {
    const list = await listWallpapers();
    note.hidden = !!list.length; note.textContent = t('noWalls');
    for (const w of list) {
      const b = thumb(w, 'wall-tile');
      if (isNewPic(w)) b.insertAdjacentHTML('beforeend', `<span class="new">${t('newTag')}</span>`);
      grid.append(b);
    }
  } catch (e) {
    console.error(e);
    note.className = 'note err'; note.textContent = t('wallsError');
  }
}
let curWall = null;
function openWall(w) {
  curWall = w;
  $('wallImg').style.backgroundImage = `url("${w.url}")`;
  openSheet('wallView');
}
$('wallSet').onclick = () => {
  if (!curWall) return;
  S.wallpaper = 'gal:' + curWall.name;
  if (keepSettings()) { store(SET_KEY, S); savedSnapshot = settingsSnapshot(); queueCloudSave(); }
  applyTheme();
  closeSheet('wallView');
  closeSheet('wallSheet');
  if (!$('setSheet').hidden) { renderSettings(); saveSettings(); }
  toast(t('wallSetDone'));
};
$('wallSave').onclick = async () => {
  if (!curWall) return;
  if (NATIVE) { openExternal(curWall.url); return; } // the browser can save the picture
  try {
    const blob = await (await fetch(curWall.url)).blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = curWall.name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch (e) { window.open(curWall.url, '_blank', 'noopener'); }
};
$('wallShare').onclick = async () => {
  if (!curWall) return;
  const title = t('brand');
  try {
    if (NATIVE) return await nativeShare({ title, text: title, url: curWall.url });
    if (navigator.share) return await navigator.share({ title, url: curWall.url });
    await navigator.clipboard.writeText(curWall.url); toast(t('linkCopied'));
  } catch (e) { /* cancelled */ }
};
$('openWalls').onclick = openWalls;

// ----- quick naam jap -----
const NAAM = ['राधे राधे', 'राम', 'सीताराम', 'हरे कृष्ण', 'ॐ नमः शिवाय', 'जय श्री राम', 'राम कृष्ण हरी', 'श्री स्वामी समर्थ', 'ॐ', 'ਵਾਹਿਗੁਰੂ'];
function renderNaam() {
  const row = $('naamRow');
  if (row.childElementCount) return;
  for (const text of NAAM) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'naam'; b.textContent = text;
    b.onclick = () => {
      let it = st.items.find((i) => i.text === text);
      if (!it) { it = newItem(text, '', 108); st.items.unshift(it); save(); renderHome(); }
      openStart(it);
    };
    row.append(b);
  }
}
function setLib(open) {
  $('lib').classList.toggle('closed', !open);
  $('libHead').setAttribute('aria-expanded', open);
}
$('libHead').onclick = () => { st.libOpen = $('lib').classList.contains('closed'); save(); setLib(st.libOpen); };
$('heroBtn').onclick = () => { const c = currentItem(); if (c) openStart(c); };
$('fab').onclick = openSettings;
$('addType').onclick = () => openEditor(null);
$('addCamera').onclick = () => $('camInput').click();
$('addPhoto').onclick = () => $('imgInput').click();

// ============ prayer library ============
const LANG_NAMES = { sa: 'संस्कृत', hi: 'हिन्दी', mr: 'मराठी', gu: 'ગુજરાતી', bn: 'বাংলা', pa: 'ਪੰਜਾਬੀ', or: 'ଓଡ଼ିଆ', ta: 'தமிழ்', te: 'తెలుగు', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', en: 'English', pra: 'प्राकृत' };
const LIB_LANGS = ['all', 'sa', 'hi', 'mr', 'gu', 'bn', 'pa', 'or', 'ta', 'te', 'kn', 'ml', 'en'];
const LIB_CATS = { all: 'catAll', mantra: 'catMantra', aarti: 'catAarti', chalisa: 'catChalisa', stuti: 'catStuti', other: 'catOther' };
let libLang = 'all', libCat = 'all';

// Every word of a prayer's names and first line, also as a sound key, so
// "हनुमान", "hanuman" and "Hanumaan" all find the same prayer.
const LIB_INDEX = LIBRARY.map((e) => {
  const hay = `${e.title} ${e.en} ${e.deity} ${e.tags} ${e.text.split('\n')[0]}`;
  return { e, lower: hay.toLowerCase(), keys: hay.split(/[\s,·()/।॥—-]+/).filter(Boolean).map(wordKey).filter(Boolean) };
});
const exact = (ix, tokens) => tokens.every((tok) => ix.lower.includes(tok.toLowerCase()));
function matches(ix, tokens) {
  return tokens.every((tok) => {
    if (ix.lower.includes(tok.toLowerCase())) return true;
    const k = wordKey(tok);
    if (!k) return true;
    return ix.keys.some((w) => similarity(k, w) >= 0.78 || (k.cons.length >= 3 && w.cons.startsWith(k.cons)));
  });
}
const inList = (text) => st.items.find((i) => i.text === text);

function openLibrary(focus) {
  renderLibrary();
  openSheet('libSheet');
  if (focus) setTimeout(() => $('libQuery').focus(), 280);
}
function chipRow(box, keys, current, label, pick) {
  box.textContent = '';
  for (const k of keys) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label(k);
    b.setAttribute('aria-pressed', k === current);
    b.onclick = () => pick(k);
    box.append(b);
  }
}
function libRow(title, sub, tag, added, iconHtml, onClick) {
  const row = document.createElement('button');
  row.type = 'button'; row.className = 'lib-row';
  row.innerHTML = `<span class="item-icon">${iconHtml}</span><span class="item-text"><b></b><small></small></span><span class="tag"></span>`;
  row.querySelector('b').textContent = title;
  row.querySelector('small').textContent = sub;
  const tg = row.querySelector('.tag');
  tg.textContent = tag; tg.classList.toggle('added', added); tg.hidden = !tag;
  row.onclick = onClick;
  return row;
}
function renderLibrary() {
  chipRow($('libLangs'), LIB_LANGS, libLang, (k) => (k === 'all' ? t('allLangs') : LANG_NAMES[k]), (k) => { libLang = k; renderLibrary(); });
  chipRow($('libCats'), Object.keys(LIB_CATS), libCat, (k) => t(LIB_CATS[k]), (k) => { libCat = k; renderLibrary(); });
  const q = $('libQuery').value.trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  const pool = LIB_INDEX.filter((ix) => (libCat === 'all' || ix.e.cat === libCat) && (libLang === 'all' || ix.e.lang === libLang));
  // exact spelling first; sound-alike matching only when nothing matches exactly
  let found = tokens.length ? pool.filter((ix) => exact(ix, tokens)) : pool;
  // tags are in English letters, so a query in an Indian script also matches by sound
  if (tokens.length && (!found.length || /[^\x00-\x7f]/.test(q))) {
    // same sound as a whole word beats "sounds a bit like"
    const strong = (ix) => tokens.every((tok) => ix.lower.includes(tok.toLowerCase()) || ix.keys.some((w) => { const k = wordKey(tok); return k && w.cons === k.cons && similarity(k, w) >= 0.85; }));
    const near = pool.filter((ix) => matches(ix, tokens));
    const best = near.filter(strong);
    found = best.length ? best : near;
  }
  const box = $('libResults');
  box.textContent = '';
  for (const { e } of found) {
    const added = !!inList(e.text);
    box.append(libRow(e.title, `${e.en} · ${LANG_NAMES[e.lang]}`, added ? '✓ ' + t('added') : t(LIB_CATS[e.cat]), added,
      isLong(e.text) ? icon('book') : 'ॐ', () => openPreview({ entry: e, title: e.title, text: e.text, meta: `${e.en} · ${e.deity} · ${LANG_NAMES[e.lang]}` })));
  }
  if (!found.length) {
    const p = document.createElement('p');
    p.className = 'lib-empty'; p.textContent = t('noMatches', { q: q || '…' });
    box.append(p);
  }
  $('onlineBtn').disabled = !q;
  $('onlineBtn').textContent = q ? t('onlineBtn', { q: googleQuery(q) }) : t('onlineBtnEmpty');
}
$('libQuery').addEventListener('input', renderLibrary);
$('libQuery').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !$('libResults').querySelector('.lib-row')) $('onlineBtn').click(); });
$('findBtn').onclick = () => openLibrary(true);
$('addLibrary').onclick = () => openLibrary(false);

// ----- online: Google search, then paste what the user copied -----
const googleQuery = (q) => (libLang === 'all' ? q : `${q} ${LANG_NAMES[libLang]}`);
$('onlineBtn').onclick = () => {
  const q = $('libQuery').value.trim();
  if (!q) return;
  const url = googleSearchUrl(googleQuery(q));
  if (NATIVE) openExternal(url); else window.open(url, '_blank', 'noopener');
};
$('pasteBtn').onclick = async () => {
  let text = '';
  try { text = (await navigator.clipboard.readText()).trim(); } catch { /* no clipboard access: the user pastes in the editor */ }
  closeSheet('libSheet');
  openEditor(null, { title: text ? $('libQuery').value.trim() : '', text }, t(text ? 'pastedNote' : 'pasteHere'));
};

// ----- preview -----
let prev = null;
function openPreview(p) {
  prev = p;
  $('prevTitle').textContent = p.title;
  $('prevMeta').textContent = p.meta;
  $('prevText').textContent = p.text;
  $('prevText').scrollTop = 0;
  renderPrevBtn();
  openSheet('prevSheet');
}
function renderPrevBtn() {
  const b = $('prevAdd');
  const existing = inList(prev.text);
  b.textContent = '';
  b.insertAdjacentHTML('beforeend', icon(existing ? 'check' : 'plus'));
  b.append(existing ? `${t('added')} · ${t('openAdded')}` : t('addToList'));
}
$('prevAdd').onclick = () => {
  const existing = inList(prev.text);
  if (existing) { closeSheet('prevSheet'); closeSheet('libSheet'); openStart(existing); return; }
  const it = newItem(prev.text, prev.title, prev.entry.target);
  st.items.unshift(it);
  save();
  renderHome();
  renderLibrary();
  renderPrevBtn();
  toast(t('addedToast'));
};

// ============ start sheet ============
const DAY_PRESETS = [0, 7, 11, 21, 40, 108]; // 0 = no limit
let startItem = null, startMode = null, startTarget = 108, startDays = 0;
let countEditing = false, dayEditing = false;

function openStart(item) {
  startItem = item;
  startMode = item.mode || null; // remembered from last time, still changeable
  startTarget = item.target;
  startDays = item.plan?.days || 0;
  countEditing = dayEditing = false;
  renderStart();
  openSheet('startSheet');
}
// a row of number chips; "Custom" opens a field that is confirmed with OK
function renderChoice(box, presets, value, editing, label, onPick, onCustom) {
  box.textContent = '';
  for (const n of presets) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip';
    b.textContent = label(n);
    b.setAttribute('aria-pressed', !editing && value === n);
    b.onclick = () => onPick(n);
    box.append(b);
  }
  const custom = !presets.includes(value) && !editing;
  const c = document.createElement('button');
  c.type = 'button'; c.className = 'chip';
  c.textContent = custom ? label(value) : t('custom');
  if (custom) c.insertAdjacentHTML('beforeend', icon('check'));
  c.setAttribute('aria-pressed', editing || custom);
  c.onclick = onCustom;
  box.append(c);
}
function renderStart() {
  const it = startItem;
  if (!it) return;
  $('startTitle').textContent = it.title || (isLong(it.text) ? t('kindPrayer') : t('kindMantra'));
  $('startPreview').textContent = it.text;

  renderChoice($('countChips'), PRESETS, startTarget, countEditing, String,
    (n) => { startTarget = n; countEditing = false; renderStart(); },
    () => { countEditing = true; renderStart(); $('countInput').value = PRESETS.includes(startTarget) ? '' : startTarget; $('countInput').focus(); });
  $('countForm').hidden = !countEditing;

  renderChoice($('dayChips'), DAY_PRESETS, startDays, dayEditing, (n) => (n ? t('daysN', { n }) : t('noLimit')),
    (n) => { startDays = n; dayEditing = false; renderStart(); },
    () => { dayEditing = true; renderStart(); $('dayInput').value = DAY_PRESETS.includes(startDays) ? '' : startDays; $('dayInput').focus(); });
  $('dayForm').hidden = !dayEditing;

  // tell the user whether an existing sankalp continues or starts again
  const note = $('dayNote'), p = planInfo(it);
  let msg = '';
  if (startDays && !dayEditing) {
    if (p && !p.over && it.plan.days === startDays) msg = t('planKeep', { d: p.day, n: p.n });
    else if (it.plan) msg = t('planRestart');
    else msg = t('dayOf', { d: 1, n: startDays });
  }
  note.hidden = !msg;
  note.textContent = msg;

  $$('.option', $('startSheet')).forEach((o) => o.setAttribute('aria-pressed', o.dataset.mode === startMode));
  $('beginBtn').disabled = !startMode;
  $('beginBtn').textContent = startMode ? t('begin') : t('chooseMode');
}
$('countForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = clampCount($('countInput').value, 0);
  if (!v) { $('countInput').focus(); return; }
  startTarget = v; countEditing = false; renderStart();
});
$('dayForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = Math.min(3650, clampCount($('dayInput').value, 0));
  if (!v) { $('dayInput').focus(); return; }
  startDays = v; dayEditing = false; renderStart();
});
$$('.option', $('startSheet')).forEach((o) => { o.onclick = () => { startMode = o.dataset.mode; renderStart(); }; });
$('beginBtn').onclick = () => {
  const it = startItem;
  if (!it || !startMode) return;
  if (it.target !== startTarget) { it.target = startTarget; if (it.count >= it.target) it.count = 0; }
  if (!startDays) it.plan = null;
  else if (!it.plan || it.plan.days !== startDays || planInfo(it).over) it.plan = { days: startDays, start: todayKey(), done: [] };
  it.mode = startMode;
  st.currentId = it.id; it.updated = Date.now();
  save();
  closeSheet('startSheet');
  startPractice(it, startMode);
};
$('startEdit').onclick = () => { closeSheet('startSheet'); openEditor(startItem); };
$('startShare').onclick = () => share(startItem);

// ============ sankalp (day plan) ============
const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
function planInfo(it) {
  const p = it?.plan;
  if (!p) return null;
  const day = dayDiff(p.start, todayKey()) + 1;
  return { n: p.days, day: Math.min(Math.max(day, 1), p.days), left: Math.max(0, p.days - day), over: day > p.days, doneToday: (p.done || []).includes(todayKey()) };
}
function planText(it) {
  const p = planInfo(it);
  if (!p) return '';
  if (p.over) return t('planDone', { n: p.n });
  const left = p.left === 0 ? t('lastDay') : p.left === 1 ? t('oneDayLeft') : t('daysLeft', { n: p.left });
  return `${t('dayOf', { d: p.day, n: p.n })} · ${left}`;
}
function renderPlanPill(el, it, withToday) {
  const p = planInfo(it);
  el.hidden = !p;
  if (!p) return;
  const done = p.doneToday || p.over;
  el.classList.toggle('done', done);
  el.innerHTML = icon(done ? 'check' : 'calendar');
  el.append(planText(it) + (withToday && p.doneToday && !p.over ? ' · ' + t('todayDone') : ''));
}

// ============ editor ============
let editing = null;
function openEditor(item, prefill = null, note = '') {
  editing = item;
  $('editTitle').textContent = item ? t('editItem') : t('newItem');
  $('editName').value = item?.title || prefill?.title || '';
  $('editText').value = item?.text || prefill?.text || '';
  $('editNote').hidden = !note;
  $('editNote').textContent = note;
  openSheet('editSheet');
  if (!item && !prefill) setTimeout(() => $('editText').focus(), 280);
}
$('editSave').onclick = () => {
  const text = $('editText').value.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (!text) { toast(t('needText')); $('editText').focus(); return; }
  const title = $('editName').value.trim();
  let it = editing;
  if (it) {
    if (it.text !== text) { it.count = 0; }
    Object.assign(it, { text, title, updated: Date.now() });
  } else {
    it = newItem(text, title);
    st.items.unshift(it);
  }
  save();
  closeSheet('editSheet');
  renderHome();
  toast(t('saved'));
  if (!editing) openStart(it);
};

// ============ scan (photo → text) ============
const scan = { bitmap: null, src: null, rot: 0, sel: null, drag: null, scale: 1 };
const sc = $('scanCanvas');
for (const id of ['camInput', 'imgInput']) {
  $(id).onchange = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try { scan.bitmap = await createImageBitmap(f); } catch (err) { toast(t('ocrBadImage')); return; }
    scan.rot = 0;
    $('scanProg').hidden = true; $('scanNote').hidden = true; $('scanRun').disabled = false;
    openSheet('scanSheet');
    prepareScan();
  };
}
function prepareScan() {
  const b = scan.bitmap;
  const s = Math.min(1, 3000 / Math.max(b.width, b.height));
  const w = Math.round(b.width * s), h = Math.round(b.height * s);
  const turned = scan.rot % 180 !== 0;
  const src = document.createElement('canvas');
  src.width = turned ? h : w; src.height = turned ? w : h;
  const g = src.getContext('2d');
  g.translate(src.width / 2, src.height / 2);
  g.rotate((scan.rot * Math.PI) / 180);
  g.drawImage(b, -w / 2, -h / 2, w, h);
  scan.src = src;
  const vs = Math.min(1, 1100 / Math.max(src.width, src.height));
  sc.width = Math.round(src.width * vs); sc.height = Math.round(src.height * vs);
  scan.scale = src.width / sc.width;
  scan.sel = null;
  drawScan();
}
function drawScan() {
  const g = sc.getContext('2d');
  g.drawImage(scan.src, 0, 0, sc.width, sc.height);
  const s = scan.sel;
  if (s && s.w > 4 && s.h > 4) {
    g.fillStyle = 'rgba(0,0,0,.55)';
    g.fillRect(0, 0, sc.width, s.y);
    g.fillRect(0, s.y + s.h, sc.width, sc.height - s.y - s.h);
    g.fillRect(0, s.y, s.x, s.h);
    g.fillRect(s.x + s.w, s.y, sc.width - s.x - s.w, s.h);
    g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f08a24';
    g.lineWidth = Math.max(2, sc.width / 300);
    g.strokeRect(s.x, s.y, s.w, s.h);
  }
}
function scanPoint(e) {
  const r = sc.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(sc.width, ((e.clientX - r.left) / r.width) * sc.width)),
    y: Math.max(0, Math.min(sc.height, ((e.clientY - r.top) / r.height) * sc.height)),
  };
}
sc.addEventListener('pointerdown', (e) => { sc.setPointerCapture(e.pointerId); scan.drag = scanPoint(e); scan.sel = null; });
sc.addEventListener('pointermove', (e) => {
  if (!scan.drag) return;
  const p = scanPoint(e), d = scan.drag;
  scan.sel = { x: Math.min(d.x, p.x), y: Math.min(d.y, p.y), w: Math.abs(p.x - d.x), h: Math.abs(p.y - d.y) };
  drawScan();
});
sc.addEventListener('pointerup', () => {
  scan.drag = null;
  if (scan.sel && (scan.sel.w < 14 || scan.sel.h < 14)) { scan.sel = null; drawScan(); }
});
$('scanRotate').onclick = () => { scan.rot = (scan.rot + 90) % 360; prepareScan(); };
$('scanAll').onclick = () => { scan.sel = null; drawScan(); };

// crop, enlarge small text, greyscale + contrast: Tesseract reads this far better
function scanInput() {
  const s = scan.sel;
  const sx = s ? s.x * scan.scale : 0, sy = s ? s.y * scan.scale : 0;
  const sw = s ? s.w * scan.scale : scan.src.width, sh = s ? s.h * scan.scale : scan.src.height;
  const up = sw < 1400 ? Math.min(2.5, 1400 / sw) : 1;
  const c = document.createElement('canvas');
  c.width = Math.round(sw * up); c.height = Math.round(sh * up);
  const g = c.getContext('2d');
  g.imageSmoothingQuality = 'high';
  g.filter = 'grayscale(1) contrast(1.35)';
  g.drawImage(scan.src, sx, sy, sw, sh, 0, 0, c.width, c.height);
  return c;
}
function loadScript(src) {
  return new Promise((res, rej) => {
    if (window.Tesseract) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.append(s);
  });
}
let ocrWorker = null, ocrLang = '';
async function getWorker(lang, logger) {
  await loadScript(TESS + 'tesseract.min.js');
  if (ocrWorker && ocrLang === lang) return ocrWorker;
  if (ocrWorker) { try { await ocrWorker.terminate(); } catch (e) {} }
  ocrWorker = await window.Tesseract.createWorker(lang, 1, { workerPath: TESS + 'worker.min.js', corePath: TESS_CORE, logger });
  ocrLang = lang;
  return ocrWorker;
}
function cleanText(text, deva) {
  let s = text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (deva) s = s.replace(/\s*\|\|\s*/g, ' ॥ ').replace(/\s*\|\s*/g, ' । ').replace(/ +\n/g, '\n').replace(/ {2,}/g, ' ');
  return s;
}
function scanNote(msg, cls = '') { const n = $('scanNote'); n.hidden = !msg; n.textContent = msg; n.className = 'note ' + cls; }
$('scanRun').onclick = async () => {
  const lang = LANGS[S.voiceLang];
  $('scanRun').disabled = true;
  $('scanProg').hidden = false; $('scanBar').style.width = '4%';
  scanNote(t('ocrLoading'));
  try {
    const worker = await getWorker(lang.ocr, (m) => {
      if (m.status === 'recognizing text') {
        $('scanBar').style.width = Math.round(12 + m.progress * 88) + '%';
        scanNote(t('ocrReading', { p: Math.round(m.progress * 100) }));
      } else if (typeof m.progress === 'number') {
        $('scanBar').style.width = Math.round(4 + m.progress * 8) + '%';
      }
    });
    const { data } = await worker.recognize(scanInput());
    const text = cleanText(data.text || '', lang.deva);
    $('scanBar').style.width = '100%';
    if (!text) { scanNote(t('ocrEmpty'), 'err'); $('scanRun').disabled = false; return; }
    closeSheet('scanSheet');
    openEditor(null, { text }, t('ocrDone'));
  } catch (err) {
    console.error(err);
    scanNote(t('ocrFail'), 'err');
    $('scanProg').hidden = true;
    $('scanRun').disabled = false;
  }
};

// ============ practice ============
const P = {
  item: null, mode: 'tap', guide: 'off',
  words: [], spans: [], speak: [], pos: 0, lastPos: -1,
  tracker: null, active: false, guideActive: false, hold: 0,
};

function startPractice(item, mode) {
  P.item = item; P.mode = mode;
  $('home').hidden = true;
  $('practice').hidden = false;
  $('practice').classList.toggle('long', isLong(item.text));
  syncAds();
  window.scrollTo(0, 0);
  buildReader();
  buildRing();
  renderCount();
  let g = st.guide || 'voice';
  if (g === 'voice' && !HAS_SR) g = 'pace';
  setGuide(g, false);
}
function leavePractice() {
  stopAll();
  $('practice').hidden = true;
  $('home').hidden = false;
  syncAds();
  renderHome();
  window.scrollTo(0, 0);
}
$('pBack').onclick = leavePractice;
$('pShare').onclick = () => share(P.item);
$('pSettings').onclick = openSettings;
$('pTune').onclick = () => { renderTuneLabels(); openSheet('tuneSheet'); };
$('resetBtn').onclick = () => {
  const it = P.item;
  if (!it.count && !it.rounds && !itemToday(it) && !it.total) return;
  if (!confirm(t('resetConfirm'))) return;
  Object.assign(it, { count: 0, rounds: 0, todayN: 0, total: 0 });
  save(); renderCount();
};

// ----- reader -----
function buildReader() {
  const box = $('reader');
  const pill = $('hlPill');
  box.textContent = '';
  box.classList.remove('sweep');
  box.append(pill);
  pill.classList.remove('on');
  box.scrollTop = 0;
  P.words = []; P.spans = []; P.speak = []; P.lines = []; P.lineOf = []; P.curLine = -1;
  for (const line of P.item.text.split(/\r?\n/)) {
    const ln = document.createElement('span');
    ln.className = 'line';
    P.lines.push(ln);
    const ws = line.split(/\s+/).filter(Boolean);
    if (!ws.length) ln.innerHTML = '&nbsp;';
    ws.forEach((w, k) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = w; s.dataset.i = P.words.length;
      s.style.setProperty('--i', P.words.length);
      ln.append(s);
      if (k < ws.length - 1) ln.append(' ');
      P.words.push(w); P.spans.push(s); P.speak.push(!!wordKey(w)); P.lineOf.push(P.lines.length - 1);
    });
    box.append(ln);
  }
  P.tracker = createTracker(P.words);
  P.lastPos = -1;
  setPos(nextSpeak(0));
}
const nextSpeak = (i) => { while (i < P.words.length && !P.speak[i]) i++; return i; };

function setPos(p) {
  const n = P.spans.length;
  p = Math.max(0, Math.min(p, n));
  const from = P.lastPos < 0 ? 0 : Math.max(0, Math.min(P.lastPos, p) - 1);
  const to = P.lastPos < 0 ? n : Math.min(n, Math.max(P.lastPos, p) + 2);
  for (let i = from; i < to; i++) P.spans[i].className = i < p ? 'w read' : i === p ? 'w cur' : 'w';
  P.lastPos = p; P.pos = p;
  // long prayers read like song lyrics: the current line is lit, the rest fade
  const li = p < n ? P.lineOf[p] : P.lines.length;
  if (li !== P.curLine) {
    P.curLine = li;
    P.lines.forEach((el, k) => { el.className = 'line' + (k < li ? ' past' : k === li ? ' now' : ''); });
    setTimeout(movePill, 480); // after the line finishes growing
  }
  $('readBar').style.width = (n ? (p / n) * 100 : 0) + '%';
  followWord(p);
  movePill();
}
// A highlight that glides from word to word instead of jumping.
function movePill() {
  const pill = $('hlPill'), box = $('reader');
  const el = P.spans[P.pos];
  if (!el || P.guide === 'off') { pill.classList.remove('on'); return; }
  const br = box.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (!r.width) return;
  pill.style.transform = `translate(${r.left - br.left + box.scrollLeft - box.clientLeft}px, ${r.top - br.top + box.scrollTop - box.clientTop}px)`;
  pill.style.width = r.width + 'px';
  pill.style.height = r.height + 'px';
  pill.classList.add('on');
  box.classList.add('pill-on');
}
// layout can move after fonts load, text size changes or a line finishes animating
window.addEventListener('resize', () => { if (!$('practice').hidden) movePill(); });
document.fonts?.ready.then(() => { if (!$('practice').hidden) movePill(); });
// keep the current word comfortably in view without jumping on every word
function followWord(p) {
  const box = $('reader');
  if (box.scrollHeight <= box.clientHeight + 4) return;
  if ($('practice').classList.contains('long')) {
    const line = P.lines[P.curLine];
    if (!line) return;
    const top = line.offsetTop + line.offsetHeight / 2 - box.clientHeight / 2;
    if (Math.abs(box.scrollTop - top) > 4) box.scrollTo({ top, behavior: 'smooth' });
    return;
  }
  const el = P.spans[Math.min(p, P.spans.length - 1)];
  if (!el) return;
  const top = el.offsetTop, h = box.clientHeight;
  if (top < box.scrollTop + h * 0.15 || top > box.scrollTop + h * 0.62) box.scrollTo({ top: Math.max(0, top - h * 0.3), behavior: 'smooth' });
}
$('reader').addEventListener('click', (e) => {
  const w = e.target.closest('.w');
  if (!w || P.guide === 'off') return;
  const i = nextSpeak(+w.dataset.i);
  P.tracker.jumpTo(i, heardLen);
  setPos(i);
  if (paceOn) schedulePace();
});

// ----- highlight guide -----
function setGuide(g, persist = true) {
  if (g === 'voice' && !HAS_SR) { toast(t('noSR')); g = 'pace'; }
  stopAll();
  P.guide = g;
  if (persist) { st.guide = g; save(); }
  $$('#guideSeg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.guide === g));
  $('paceRow').hidden = g !== 'pace';
  $('wpm').value = st.wpm;
  $('reader').classList.toggle('off', g === 'off');
  P.tracker.jumpTo(0, heardLen);
  setPos(nextSpeak(0));
  refreshPractice();
}
$$('#guideSeg button').forEach((b) => { b.onclick = () => setGuide(b.dataset.guide); });
$('wpm').addEventListener('input', (e) => { st.wpm = +e.target.value; $('paceLabel').textContent = t('pace', { n: st.wpm }); save(); });

// ----- follow voice -----
let rec = null, recWanted = false, heardLen = 0, endTimer = 0, renderQueued = false;
let nativeRec = null;

function startRecognition() {
  if (!HAS_SR) { setLive(t('noSR'), 'err'); return false; }
  recWanted = true;
  if (NATIVE) { startNativeRecognition(); return true; }
  spawnRecognizer();
  return true;
}
function startNativeRecognition() {
  startNativeSpeech(LANGS[S.voiceLang].sr, {
    onSession: () => { P.tracker.newSession(); heardLen = 0; },
    onWords: (words) => { if (recWanted) onHeard(words); },
    onSpeaking: (on) => setSpeaking(on),
    onError: () => { stopAll(); setLive(t('micDenied'), 'err'); },
  }).then((r) => {
    if (recWanted) nativeRec = r; else r.stop();
  }).catch((e) => {
    stopAll();
    setLive(e?.code === 'not-allowed' ? t('micDenied') : t('noSR'), 'err');
  });
}
function spawnRecognizer() {
  const r = new SR();
  rec = r;
  r.lang = LANGS[S.voiceLang].sr;
  // Android Chrome repeats earlier text in continuous mode; short sessions avoid that
  r.continuous = !ANDROID;
  r.interimResults = true;
  r.maxAlternatives = 1;
  r.onstart = () => { P.tracker.newSession(); heardLen = 0; };
  r.onspeechstart = () => setSpeaking(true);
  r.onspeechend = () => setSpeaking(false);
  r.onresult = (ev) => onHeard(collectWords(ev.results));
  r.onerror = (e) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { stopAll(); setLive(t('micDenied'), 'err'); }
    else if (e.error === 'language-not-supported') { stopAll(); setLive(t('srLang'), 'err'); }
    else if (e.error === 'network') setLive(t('srNetwork'), 'err');
    // "no-speech" and "aborted" are routine; onend restarts
  };
  r.onend = () => {
    if (rec !== r || !recWanted) return;
    try { r.start(); } catch (err) { setTimeout(() => { if (rec === r && recWanted) spawnRecognizer(); }, 300); }
  };
  try { r.start(); } catch (e) {}
}
function stopRecognition() {
  recWanted = false;
  clearTimeout(endTimer);
  const r = rec;
  rec = null;
  if (r) { try { r.abort(); } catch (e) {} }
  if (nativeRec) { nativeRec.stop(); nativeRec = null; }
  setSpeaking(false);
  $('heard').textContent = '';
}
function collectWords(results) {
  const out = [];
  let prev = '';
  for (let i = 0; i < results.length; i++) {
    const full = results[i][0].transcript.trim();
    let txt = full;
    if (ANDROID && prev && full.startsWith(prev)) txt = full.slice(prev.length);
    prev = full;
    for (const w of txt.split(/\s+/)) if (w) out.push(w);
  }
  return out;
}
// words the recogniser hears drift up around the mala
let lastFloatLen = 0;
function floatWord(w) {
  if ($('practice').classList.contains('long') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('floaters');
  if (box.childElementCount > 5) box.firstElementChild.remove();
  const el = document.createElement('span');
  el.textContent = w;
  el.style.left = (12 + Math.random() * 76).toFixed(0) + '%';
  el.style.fontSize = (16 + Math.random() * 14).toFixed(0) + 'px';
  el.style.setProperty('--tilt', (Math.random() * 16 - 8).toFixed(0) + 'deg');
  box.append(el);
  setTimeout(() => el.remove(), 2600);
}
function onHeard(words) {
  heardLen = words.length;
  const autoCount = P.mode === 'auto';
  const done = P.tracker.update(words, autoCount);
  if (done) {
    for (let k = 0; k < done; k++) add({ fromVoice: true });
    // let the finished line show for a moment before returning to the top
    setPos(P.spans.length);
    P.hold = performance.now() + 380;
  }
  queueRender();
  $('heard').textContent = words.length ? '“' + words.slice(-5).join(' ') + '”' : '';
  if (words.length && words.length !== lastFloatLen) floatWord(words[words.length - 1]);
  lastFloatLen = words.length;
  // only the last word left and the reader pauses: the recogniser may have
  // dropped it (short endings like नमः often are), so finish the recitation
  clearTimeout(endTimer);
  if (autoCount && P.tracker.atLastWord) {
    endTimer = setTimeout(() => {
      if (!recWanted || !P.tracker.atLastWord) return;
      P.tracker.jumpTo(0, heardLen);
      add({ fromVoice: true });
      setPos(P.spans.length);
      P.hold = performance.now() + 380;
      queueRender();
    }, 1400);
  }
}
function queueRender() {
  if (renderQueued) return;
  renderQueued = true;
  const run = () => {
    const wait = P.hold - performance.now();
    if (wait > 0) { setTimeout(run, wait); return; }
    renderQueued = false;
    if (P.guide === 'voice') setPos(P.tracker.pos);
  };
  requestAnimationFrame(run);
}

// ----- steady pace -----
let paceOn = false, paceTimer = 0;
function schedulePace() {
  clearTimeout(paceTimer);
  if (!paceOn || P.pos >= P.words.length) return; // waits at the end for the next count
  const len = Math.min(2.2, Math.max(0.6, [...P.words[P.pos]].length / 5));
  paceTimer = setTimeout(() => { setPos(nextSpeak(P.pos + 1)); schedulePace(); }, (60000 / st.wpm) * len);
}
function startPace() { paceOn = true; schedulePace(); }
function stopPace() { paceOn = false; clearTimeout(paceTimer); }

// ----- auto counting by voice rhythm (works offline, any language) -----
let stream = null, audioCtx = null, raf = 0;
async function startRhythm() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  audioCtx.createMediaStreamSource(stream).connect(analyser);
  const buf = new Float32Array(analyser.fftSize);
  let calibrating = performance.now(), samples = [], floor = 0.01;
  let voiced = false, voiceStart = 0, lastLoud = 0, voicedMs = 0, last = performance.now();
  const threshold = () => Math.max(floor * (1.5 + (10 - st.sens) * 0.6), 0.004);
  setLive(t('calibrating'), '');
  $('meter').hidden = false;
  const loop = () => {
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    const now = performance.now(), dt = now - last;
    last = now;
    if (calibrating) {
      samples.push(rms);
      if (now - calibrating > 1200) {
        samples.sort((a, b) => a - b);
        floor = Math.max(samples[Math.floor(samples.length * 0.6)] || 0.005, 0.002);
        calibrating = 0;
        setLive(t('listening'), 'on');
        if (P.guide === 'pace') startPace();
      }
    } else if (rms > threshold()) {
      if (!voiced) { voiced = true; voiceStart = now; voicedMs = 0; }
      lastLoud = now; voicedMs += dt;
      setSpeaking(true);
    } else if (voiced && now - lastLoud > st.gap * 1000) {
      voiced = false;
      setSpeaking(false);
      const min = st.minLen * 1000;
      if (lastLoud - voiceStart >= min && voicedMs >= min * 0.4) add();
    }
    const th = threshold(), scale = th * 3;
    $('meterLevel').style.width = Math.min(100, (rms / scale) * 100) + '%';
    $('meterTh').style.left = Math.min(100, (th / scale) * 100) + '%';
    raf = requestAnimationFrame(loop);
  };
  loop();
}
function stopRhythm() {
  cancelAnimationFrame(raf);
  stream?.getTracks().forEach((tr) => tr.stop());
  audioCtx?.close().catch(() => {});
  stream = null; audioCtx = null;
  $('meter').hidden = true;
}

// ----- start / stop -----
let wakeLock = null;
async function keepAwake(on) {
  if (NATIVE) return nativeKeepAwake(on);
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && (P.active || P.guideActive)) keepAwake(true); });

async function startListening() {
  if (P.guide === 'voice') {
    if (!startRecognition()) return;
    P.active = true;
    setLive(t('listeningWords'), 'on');
  } else {
    if (!navigator.mediaDevices?.getUserMedia) { setLive(t('noMic'), 'err'); return; }
    try { await startRhythm(); P.active = true; }
    catch (e) { stopAll(); setLive(t('micDenied'), 'err'); return; }
  }
  keepAwake(true);
  refreshPractice(false);
}
function toggleGuide() {
  if (P.guideActive) { stopAll(); return; }
  if (P.guide === 'voice') { if (!startRecognition()) return; setLive(t('listeningWords'), 'on'); }
  else if (P.guide === 'pace') startPace();
  P.guideActive = true;
  keepAwake(true);
  refreshPractice(false);
}
function stopAll() {
  stopRecognition(); stopRhythm(); stopPace();
  const was = P.active || P.guideActive;
  P.active = false; P.guideActive = false;
  keepAwake(false);
  if (!$('practice').hidden) refreshPractice(!was);
  if (was) setLive(t('paused'), '');
}

function setLive(text, cls) {
  const l = $('live');
  const speaking = l.classList.contains('speaking');
  l.className = 'live' + (cls ? ' ' + cls : '') + (speaking && cls === 'on' ? ' speaking' : '');
  $('liveText').textContent = text;
  // the mala breathes softly while the app is listening
  $('ring').classList.toggle('listening', cls === 'on');
}
function setSpeaking(on) {
  $('live').classList.toggle('speaking', on);
  $('ring').classList.toggle('speaking', on);
}
function refreshPractice(resetLive = true) {
  const auto = P.mode === 'auto';
  $('pMode').textContent = auto ? t('modeAloud') : t('modeMind');
  $('pTune').hidden = !auto || P.guide === 'voice';
  $('paceLabel').textContent = t('pace', { n: st.wpm });

  const tg = $('guideToggle');
  tg.hidden = auto || P.guide === 'off';
  tg.innerHTML = icon(P.guideActive ? 'pause' : 'play');
  const tgl = P.guideActive ? t('stopGuide') : t('startGuide');
  tg.setAttribute('aria-label', tgl); tg.title = tgl;

  const mb = $('mainBtn');
  mb.classList.toggle('tap-btn', !auto);
  mb.classList.toggle('btn-primary', !(auto && P.active));
  mb.classList.toggle('is-on', auto && P.active);
  mb.textContent = '';
  if (auto) {
    mb.insertAdjacentHTML('beforeend', icon(P.active ? 'stop' : 'mic'));
    mb.append(P.active ? t('stop') : P.guide === 'voice' ? t('startReading') : t('startChanting'));
  } else {
    const b = document.createElement('span'); b.textContent = t('tap');
    const s = document.createElement('small'); s.textContent = t('tapHint');
    mb.append(b, s);
  }
  if (resetLive && !P.active && !P.guideActive) {
    if (auto) setLive(P.guide === 'voice' ? t('hintRead') : t('hintChant'), '');
    else setLive(P.guide === 'off' ? '' : t('tapWordHint'), '');
  }
}

$('mainBtn').addEventListener('pointerdown', (e) => {
  if (P.mode !== 'tap' || e.button > 0) return;
  e.preventDefault();
  add();
});
$('mainBtn').addEventListener('click', (e) => {
  if (P.mode === 'tap') { if (e.detail === 0) add(); return; } // keyboard activation
  if (P.active) stopAll(); else startListening();
});
$('guideToggle').onclick = toggleGuide;
$('ring').addEventListener('click', () => add());
$('strip').querySelector('.mini-ring').addEventListener('click', () => add());
$('pUndo').onclick = undo;
document.addEventListener('keydown', (e) => {
  if ($('practice').hidden || openSheets.length) return;
  if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(document.activeElement?.tagName) && e.code !== 'Space') return;
  if (e.code === 'Space') { e.preventDefault(); add(); }
  else if (e.code === 'Backspace') { e.preventDefault(); undo(); }
});

// ----- counting -----
let resetHighlightTimer = 0;
function add(opts = {}) {
  const it = P.item;
  if (it.todayDay !== todayKey()) { it.todayDay = todayKey(); it.todayN = 0; }
  it.count++; it.todayN++; it.total = (it.total || 0) + 1; it.updated = Date.now();
  addHist(1);
  let complete = false;
  if (it.count >= it.target) {
    it.rounds++; it.count = 0; complete = true;
    if (it.plan) { it.plan.done ||= []; if (!it.plan.done.includes(todayKey())) it.plan.done.push(todayKey()); }
  }
  save();
  renderCount(true, complete);
  if (complete) {
    bell();
    vibrate([180, 90, 180, 90, 360]);
    toast(t('roundDone', { r: it.rounds, n: it.target }));
  } else {
    beadClick();
    vibrate(20);
  }
  // the next recitation starts again from the first word
  if (!opts.fromVoice) {
    P.tracker.jumpTo(0, heardLen);
    clearTimeout(resetHighlightTimer);
    resetHighlightTimer = setTimeout(() => { setPos(nextSpeak(0)); $('reader').scrollTop = 0; if (paceOn) schedulePace(); }, 0);
  }
}
function undo() {
  const it = P.item;
  if (it.count > 0) it.count--;
  else if (it.rounds > 0) { it.rounds--; it.count = it.target - 1; }
  else return;
  if (itemToday(it) > 0) { it.todayN--; addHist(-1); }
  it.total = Math.max(0, (it.total || 0) - 1);
  save();
  renderCount();
}

// ----- ring: a rudraksha mala -----
// One bead per recitation (a full mala has 108); counts above 108 share beads.
// Counting starts beside the guru (meru) bead at the bottom and goes round.
let beads = [];
const MALA_R = 88;
function buildRing() {
  const g = $('beads');
  g.textContent = '';
  beads = [];
  const target = P.item.target;
  $('ring').classList.toggle('arcmode', target < 8);
  if (target < 8) return;
  const n = Math.min(target, 108);
  const step = (2 * Math.PI * MALA_R) / (n + 1.6); // room for the guru bead
  const r = Math.min(7, step * 0.49);
  const gap = (step * 1.6) / MALA_R;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  g.append(el('circle', { cx: 100, cy: 100, r: MALA_R, class: 'thread' }));
  for (let i = 0; i < n; i++) {
    const a = Math.PI / 2 + gap / 2 + (i / (n - 1)) * (2 * Math.PI - gap);
    const c = el('circle', { cx: (100 + MALA_R * Math.cos(a)).toFixed(2), cy: (100 + MALA_R * Math.sin(a)).toFixed(2), r: r.toFixed(2), class: 'bead' });
    c.style.strokeDasharray = `${(r * 0.32).toFixed(2)} ${(r * 0.38).toFixed(2)}`; // the grooves of a rudraksha
    g.append(c); beads.push(c);
  }
  // guru bead and tassel
  const my = 100 + MALA_R + r * 0.4;
  g.append(el('path', { class: 'tassel', d: `M100 ${my + 9} l-7 26 q7 4 14 0 z` }));
  for (let k = -2; k <= 2; k++) g.append(el('line', { class: 'tassel-line', x1: 100 + k * 1.2, y1: my + 14, x2: 100 + k * 2.6, y2: my + 34 }));
  g.append(el('circle', { cx: 100, cy: my + 9, r: 2.6, class: 'knot' }));
  g.append(el('circle', { cx: 100, cy: my, r: (r * 1.35).toFixed(2), class: 'bead meru' }));
}
function renderCount(bump, complete) {
  const it = P.item;
  const shown = complete ? it.target : it.count;
  $('count').textContent = shown;
  $('of').textContent = t('of', { n: it.target });
  $('sRound').textContent = it.rounds;
  $('mCount').textContent = shown;
  $('mOf').textContent = t('recitations', { c: shown, t: it.target });
  $('mSub').textContent = t('stripSub', { r: it.rounds, n: itemToday(it) });
  $('miniArc').style.strokeDashoffset = (131.95 * (1 - shown / it.target)).toFixed(2);
  renderPlanPill($('sPlan'), it, true);
  renderPlanPill($('mPlan'), it, false);
  $('sToday').textContent = itemToday(it);
  $('sTotal').textContent = it.total || 0;
  const frac = shown / it.target;
  $('arc').style.strokeDashoffset = (578 * (1 - frac)).toFixed(1);
  const lit = Math.floor(frac * beads.length);
  beads.forEach((b, i) => b.setAttribute('class', 'bead' + (i < lit ? ' done' : '') + (i === lit - 1 ? ' current' : '')));
  if (bump) {
    for (const c of [$('count'), $('mCount')]) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    replay($('ripple'), 'go');
    if (lit > 0) replay(beads[lit - 1], 'pop');
    if (!$('practice').classList.contains('long')) {
      const r = $('reader');
      replay(r, 'sweep');
      // switch the shimmer off once it has passed over every word
      clearTimeout(sweepTimer);
      sweepTimer = setTimeout(() => r.classList.remove('sweep'), 900 + P.words.length * 70 + 100);
    }
  }
  if (complete) {
    for (const [el, cls] of [[$('ring'), 'complete'], [$('strip'), 'done']]) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
    petals();
    setTimeout(() => renderCount(), 1200);
  }
}

let sweepTimer = 0;
// restart a CSS animation on an element (also SVG beads)
function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
}
// marigold petals drift down when a round is complete
function petals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div');
  box.className = 'petals';
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's';
    p.style.animationDuration = (2.4 + Math.random() * 1.6).toFixed(2) + 's';
    p.style.setProperty('--drift', (Math.random() * 120 - 60).toFixed(0) + 'px');
    p.style.setProperty('--spin', (Math.random() * 540 - 270).toFixed(0) + 'deg');
    p.style.setProperty('--hue', Math.random() < 0.55 ? '#f59e0b' : Math.random() < 0.5 ? '#f97316' : '#fde047');
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 5200);
}

// ----- tuning -----
function renderTuneLabels() {
  $('gapLabel').textContent = t('gap', { n: st.gap });
  $('sensLabel').textContent = t('sens', { n: st.sens });
  $('minLabel').textContent = t('minLen', { n: st.minLen });
}
for (const k of ['gap', 'sens', 'minLen']) {
  $(k).value = st[k];
  $(k).addEventListener('input', (e) => { st[k] = +e.target.value; renderTuneLabels(); save(); });
}

// ============ share ============
function shareUrl(it) {
  const base = NATIVE ? WEB_URL : location.origin + location.pathname.replace(/index\.html$/, '');
  const q = new URLSearchParams({ m: it.text, n: it.target });
  if (it.title) q.set('t', it.title);
  return base + '?' + q.toString();
}
async function share(it) {
  if (!it) return;
  const url = shareUrl(it);
  try {
    if (NATIVE) { await nativeShare({ title: it.title || t('brand'), text: (it.title || it.text.slice(0, 120)) + ' · ' + t('timesN', { n: it.target }), url }); return; }
    if (navigator.share) { await navigator.share({ title: it.title || t('brand'), text: (it.title || it.text.slice(0, 120)) + ' · ' + t('timesN', { n: it.target }), url }); return; }
  } catch (e) { if (e?.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast(t('linkCopied')); }
  catch (e) { prompt(t('copyLink'), url); }
}

// ============ settings ============
function openSettings() {
  savedSnapshot = settingsSnapshot();
  renderWallCard();
  renderSettings();
  saveSettings();
  openSheet('setSheet');
}
function renderSettings() {
  $$('#uiLangSeg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === S.uiLang));
  $$('#fontSeg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === S.font));
  $$('#soundSeg button').forEach((b) => b.setAttribute('aria-pressed', (b.dataset.v === 'on') === (S.sound !== false)));
  $$('#vibeSeg button').forEach((b) => b.setAttribute('aria-pressed', (b.dataset.v === 'on') === (S.vibe !== false)));
  const vl = $('voiceLang');
  if (!vl.options.length) for (const k in LANGS) vl.add(new Option(LANGS[k].name, k));
  vl.value = S.voiceLang;
  const th = THEMES[S.theme];
  $('cBg').value = S.bg || th.bg;
  $('cPanel').value = S.panel || th.surface;
  $('cText').value = S.text || th.text;
  $('cHl').value = S.hl || th.gold;
  $('ts').value = S.ts;
  $('tsLabel').textContent = t('textSize', { n: S.ts });
  $('dim').value = S.dim;
  $('dimLabel').textContent = t('dim', { n: Math.round(S.dim * 100) });
  const noWp = S.wallpaper === 'none' || (S.wallpaper === 'custom' && !wpData);
  $('dimRow').hidden = $('cardRow').hidden = $('blurRow').hidden = noWp;
  $('cardA').value = S.cardT ?? 0.4;
  $('cardLabel').textContent = t('cardT', { n: Math.round((S.cardT ?? 0.4) * 100) });
  $('cardBlur').value = S.cardBlur ?? 14;
  $('blurLabel').textContent = t('cardBlurL', { n: S.cardBlur ?? 14 });
  saveSettings(); // keep the Save button's state in step

  const ts = $('themeSw');
  ts.textContent = '';
  for (const k in THEMES) {
    const x = THEMES[k];
    const b = document.createElement('button');
    b.className = 'swatch';
    b.setAttribute('aria-pressed', S.theme === k);
    b.style.background = `linear-gradient(135deg, ${x.bg} 0 50%, ${x.accent} 50% 75%, ${x.gold} 75%)`;
    const s = document.createElement('span'); s.textContent = t(x.name);
    b.append(s);
    b.onclick = () => { S.theme = k; S.bg = ''; S.panel = ''; S.text = ''; S.hl = ''; saveSettings(); applyTheme(); renderSettings(); };
    ts.append(b);
  }
  const ws = $('wpSw');
  ws.textContent = '';
  for (const k of [...Object.keys(WALLPAPERS), 'custom']) {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.setAttribute('aria-pressed', S.wallpaper === k);
    const s = document.createElement('span');
    if (k === 'custom') {
      if (wpData) b.style.backgroundImage = `url("${wpData}")`;
      else { b.style.background = 'var(--surface-2)'; b.insertAdjacentHTML('afterbegin', `<span style="position:absolute;inset:0;display:grid;place-items:center;background:none;color:var(--text-2)">${icon('image')}</span>`); }
      s.textContent = t('wpUpload');
      b.onclick = () => (wpData && S.wallpaper !== 'custom' ? (S.wallpaper = 'custom', saveSettings(), applyTheme(), renderSettings()) : $('wpInput').click());
    } else {
      const w = WALLPAPERS[k];
      b.style.background = w.css || THEMES[S.theme].bg;
      if (w.tile) { b.style.backgroundColor = '#1f150e'; b.style.backgroundSize = '44px 44px'; }
      s.textContent = t(w.name);
      b.onclick = () => { S.wallpaper = k; saveSettings(); applyTheme(); renderSettings(); };
    }
    b.append(s);
    ws.append(b);
  }
}
$$('#uiLangSeg button').forEach((b) => { b.onclick = () => { S.uiLang = b.dataset.v; saveSettings(); applyI18n(); }; });
$$('#fontSeg button').forEach((b) => { b.onclick = () => { S.font = b.dataset.v; saveSettings(); applyTheme(); renderSettings(); }; });
$$('#soundSeg button').forEach((b) => { b.onclick = () => { S.sound = b.dataset.v === 'on'; saveSettings(); renderSettings(); if (S.sound) beadClick(); }; });
$$('#vibeSeg button').forEach((b) => { b.onclick = () => { S.vibe = b.dataset.v === 'on'; saveSettings(); renderSettings(); vibrate(30); }; });
$('voiceLang').onchange = (e) => {
  S.voiceLang = e.target.value;
  saveSettings();
  if (recWanted) { stopRecognition(); startRecognition(); }
};
for (const [id, k] of [['cBg', 'bg'], ['cPanel', 'panel'], ['cText', 'text'], ['cHl', 'hl']]) {
  $(id).addEventListener('input', (e) => { S[k] = e.target.value; saveSettings(); applyTheme(); });
}
$('colorsReset').onclick = () => { S.bg = ''; S.panel = ''; S.text = ''; S.hl = ''; saveSettings(); applyTheme(); renderSettings(); };
$('ts').addEventListener('input', (e) => { S.ts = +e.target.value; $('tsLabel').textContent = t('textSize', { n: S.ts }); saveSettings(); applyTheme(); });
$('dim').addEventListener('input', (e) => { S.dim = +e.target.value; $('dimLabel').textContent = t('dim', { n: Math.round(S.dim * 100) }); saveSettings(); applyTheme(); });
// while a wallpaper slider is dragged, Settings steps aside so the change shows on the real screen
function peek(on, row) {
  document.body.classList.toggle('peek', on);
  $$('.peekable').forEach((r) => r.classList.toggle('peeking', on && r === row));
}
$$('.peekable input[type=range]').forEach((inp) => {
  inp.addEventListener('pointerdown', () => peek(true, inp.closest('.peekable')));
});
for (const ev of ['pointerup', 'pointercancel', 'blur']) window.addEventListener(ev, () => { if (!colorPeek && document.body.classList.contains('peek')) peek(false); });
// the colour picker is a pop-up: Settings steps aside while it is open, so new colours show on the real screen
let colorPeek = false;
const endColorPeek = () => { if (colorPeek) { colorPeek = false; peek(false); } };
$$('.colors input[type=color]').forEach((inp) => {
  inp.addEventListener('click', () => { colorPeek = true; peek(true, $('colorsRow')); });
  inp.addEventListener('change', endColorPeek);
});
document.addEventListener('pointerdown', (e) => { if (colorPeek && !e.target.closest('.colors')) endColorPeek(); }, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') endColorPeek(); });
$('cardA').addEventListener('input', (e) => { S.cardT = +e.target.value; $('cardLabel').textContent = t('cardT', { n: Math.round(S.cardT * 100) }); saveSettings(); applyTheme(); });
$('cardBlur').addEventListener('input', (e) => { S.cardBlur = +e.target.value; $('blurLabel').textContent = t('cardBlurL', { n: S.cardBlur }); saveSettings(); applyTheme(); });
$('setSave').onclick = async () => {
  if (!settingsDirty()) { closeSheet('setSheet'); return; }
  // guests cannot keep settings: invite them to sign in instead
  if (AUTH_ON && !user && !read(SIGNED_KEY)) { savedSnapshot = settingsSnapshot(); closeSheet('setSheet'); openAuth(); return; }
  store(SET_KEY, S);
  if (S.wallpaper === 'custom' && wpData) store(WP_KEY, wpData);
  savedSnapshot = settingsSnapshot();
  clearTimeout(cloudTimer);
  await pushCloud();
  closeSheet('setSheet');
  toast(t('settingsSaved'));
};
$('setReset').onclick = () => {
  if (!confirm(t('resetSetConfirm'))) return;
  Object.assign(S, DEFAULT_SETTINGS, { uiLang: S.uiLang });
  saveSettings(); applyTheme(); applyI18n(); renderSettings();
};
$('wpInput').onchange = async (e) => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  try {
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, 1440 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const data = c.toDataURL('image/jpeg', 0.82);
    if (keepSettings() && !store(WP_KEY, data)) toast(t('wpTooBig'));
    wpData = data;
    S.wallpaper = 'custom';
    saveSettings(); applyTheme(); renderSettings();
  } catch (err) { toast(t('ocrBadImage')); }
};

// ============ accounts ============
let cloudTimer = 0;
function queueCloudSave() {
  if (!cloud || !user) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(pushCloud, 1500);
}
async function pushCloud() {
  if (!cloud || !user) return;
  try { await cloud.save(user.id, st, { ...S, wpData: S.wallpaper === 'custom' ? wpData : null }); }
  catch (e) { console.error(e); }
}
window.addEventListener('pagehide', () => { if (cloudTimer) pushCloud(); });

// Bring together what is on this device and what is in the account.
function mergeState(remote) {
  const byId = new Map(st.items.map((i) => [i.id, i]));
  for (const r of remote.items || []) {
    const l = byId.get(r.id);
    if (!l || (r.updated || 0) >= (l.updated || 0)) byId.set(r.id, r);
  }
  // the same text added on two devices: keep the most recently used copy
  const byText = new Map();
  for (const it of byId.values()) {
    const o = byText.get(it.text);
    if (!o || (it.updated || 0) > (o.updated || 0)) byText.set(it.text, it);
  }
  st.items = [...byText.values()];
  st.total = Math.max(st.total || 0, remote.total || 0);
  st.hist ||= {};
  for (const [k, v] of Object.entries(remote.hist || {})) st.hist[k] = Math.max(st.hist[k] || 0, v);
  if (remote.day === st.day) st.todayCount = Math.max(st.todayCount || 0, remote.todayCount || 0);
  for (const k of ['gap', 'sens', 'minLen', 'wpm', 'guide', 'libOpen']) if (remote[k] != null) st[k] = remote[k];
  if (remote.currentId && itemById(remote.currentId)) st.currentId = remote.currentId;
  if (!itemById(st.currentId)) st.currentId = null;
}

async function afterSignIn() {
  store(SIGNED_KEY, '1');
  closeSheet('authSheet');
  let remote = null;
  try { remote = await cloud.load(user.id); } catch (e) { console.error(e); toast(t('syncError')); }
  if (remote?.state?.items) mergeState(remote.state);
  if (remote?.settings && Object.keys(remote.settings).length) {
    const { wpData: w, ...rest } = remote.settings;
    Object.assign(S, DEFAULT_SETTINGS, rest);
    wpData = w || null;
  }
  store(KEY, st);
  store(SET_KEY, S);
  if (wpData) store(WP_KEY, wpData);
  pushCloud();
  if (P.item) P.item = itemById(P.item.id) || P.item;
  applyTheme();
  applyI18n();
  if (!$('practice').hidden) renderCount();
  renderAccount();
}
function afterSignOut() {
  try { [SIGNED_KEY, SET_KEY, WP_KEY, KEY].forEach((k) => localStorage.removeItem(k)); } catch (e) {}
  // this device goes back to a fresh guest state; everything stays in the account
  Object.assign(st, freshState());
  store(KEY, st);
  const lang = S.uiLang;
  Object.assign(S, DEFAULT_SETTINGS, { uiLang: lang });
  wpData = null;
  if (!$('practice').hidden) leavePractice();
  applyTheme();
  applyI18n();
  renderAccount();
  toast(t('signedOut'));
}

function initials(u) {
  const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email || '?';
  return name.trim().charAt(0).toUpperCase();
}
function fillAvatar(el, u) {
  el.textContent = '';
  const pic = u.user_metadata?.avatar_url || u.user_metadata?.picture;
  if (pic) {
    const img = document.createElement('img');
    img.src = pic; img.alt = ''; img.referrerPolicy = 'no-referrer';
    img.onerror = () => { el.textContent = initials(u); };
    el.append(img);
  } else el.textContent = initials(u);
}
function renderAccount() {
  const b = $('accountBtn');
  b.hidden = !AUTH_ON;
  if (!AUTH_ON) return;
  b.classList.toggle('signed', !!user);
  b.textContent = '';
  if (user) {
    const a = document.createElement('span');
    a.className = 'avatar';
    fillAvatar(a, user);
    b.append(a);
    b.setAttribute('aria-label', t('account'));
    fillAvatar($('accAvatar'), user);
    $('accName').textContent = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
    $('accEmail').textContent = user.email || '';
  } else {
    b.textContent = t('signIn');
    b.setAttribute('aria-label', t('signIn'));
  }
  $('guestNote').hidden = !!user;
}
$('accountBtn').onclick = () => (user ? openSheet('accountSheet') : openAuth());
$('guestSignIn').onclick = () => { closeSheet('setSheet'); openAuth(); };
$('signOutBtn').onclick = async () => {
  closeSheet('accountSheet');
  await pushCloud();
  try { await cloud.signOut(); } catch (e) { console.error(e); }
  if (user) { user = null; afterSignOut(); }
};

// Deleting an account: the saved data goes now; the login itself is removed by us on request (email).
const CONTACT = 'patil.jitesh866@gmail.com';
$('deleteAccBtn').onclick = async () => {
  if (!user || !confirm(t('deleteAccConfirm'))) return;
  const email = user.email || '';
  closeSheet('accountSheet');
  clearTimeout(cloudTimer); cloudTimer = 0;
  try { await cloud.removeData(user.id); } catch (e) { console.error(e); }
  try { await cloud.signOut(); } catch (e) { console.error(e); }
  user = null; afterSignOut();
  toast(t('deleteAccDone'));
  const subject = encodeURIComponent('Delete my JapSadhna account');
  const body = encodeURIComponent(`Please delete my JapSadhna account: ${email}`);
  setTimeout(() => { location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`; }, 600);
};

let authMode = 'signin';
function openAuth(mode = 'signin') {
  authMode = mode;
  renderAuth();
  openSheet('authSheet');
}
function renderAuth() {
  const recover = authMode === 'recover';
  $('authMain').hidden = recover;
  $('recoverForm').hidden = !recover;
  $('authTitle').textContent = recover ? t('newPassword') : authMode === 'signup' ? t('signUp') : t('signIn');
  $('authSubmit').textContent = authMode === 'signup' ? t('signUp') : t('signIn');
  $('authSwitch').textContent = authMode === 'signup' ? t('haveAccount') : t('noAccount');
  $('authForgot').hidden = authMode === 'signup';
  $('authPw').autocomplete = authMode === 'signup' ? 'new-password' : 'current-password';
  authNote('');
}
function authNote(msg, cls = '', id = 'authNote') {
  const n = $(id);
  n.hidden = !msg; n.textContent = msg; n.className = 'note ' + cls;
}
$('authSwitch').onclick = () => { authMode = authMode === 'signup' ? 'signin' : 'signup'; renderAuth(); };
$('googleBtn').onclick = async () => {
  try { await cloud.google(); } catch (e) { authNote(e.message || String(e), 'err'); }
};
$('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('authEmail').value.trim(), pw = $('authPw').value;
  if (!email) return authNote(t('needEmail'), 'err');
  if (pw.length < 6) return authNote(t('pwShort'), 'err');
  const btn = $('authSubmit');
  btn.disabled = true;
  try {
    if (authMode === 'signup') {
      const data = await cloud.signUp(email, pw);
      if (!data.session) authNote(t('checkEmail'), 'ok'); // email confirmation is on
    } else {
      await cloud.signIn(email, pw);
    }
  } catch (err) {
    authNote(err.message || String(err), 'err');
  } finally {
    btn.disabled = false;
  }
});
$('authForgot').onclick = async () => {
  const email = $('authEmail').value.trim();
  if (!email) { authNote(t('needEmail'), 'err'); $('authEmail').focus(); return; }
  try { await cloud.sendReset(email); authNote(t('resetSent'), 'ok'); }
  catch (err) { authNote(err.message || String(err), 'err'); }
};
$('recoverForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const pw = $('newPw').value;
  if (pw.length < 6) return authNote(t('pwShort'), 'err', 'recoverNote');
  try { await cloud.setPassword(pw); closeSheet('authSheet'); toast(t('passwordSet')); }
  catch (err) { authNote(err.message || String(err), 'err', 'recoverNote'); }
});

async function initAccounts() {
  renderAccount();
  if (!AUTH_ON) return;
  const env = NATIVE
    ? { linkBack: WEB_URL, oauthBack: AUTH_CALLBACK, openExternal } // Google blocks sign-in inside apps: use the browser
    : { linkBack: location.origin + location.pathname, oauthBack: location.origin + location.pathname };
  try { cloud = await connect(SUPABASE_URL, SUPABASE_ANON_KEY, env); }
  catch (e) { console.error(e); $('accountBtn').hidden = true; return; }
  const signedIn = async (u) => {
    if (!u || user?.id === u.id) return;
    const fresh = !read(SIGNED_KEY); // a new sign-in on this device, not a returning visit
    user = u;
    renderAccount();
    await afterSignIn();
    if (fresh) toast(t('welcome'));
  };
  if (NATIVE) {
    onAppLink(async (url) => {
      if (!url.startsWith(AUTH_CALLBACK)) return;
      closeExternal();
      try { await cloud.finishOAuth(url); } catch (e) { toast(e.message || String(e)); }
    });
  }
  cloud.onChange((event, u) => {
    if (event === 'PASSWORD_RECOVERY') { user = u; openAuth('recover'); return; }
    if (u) signedIn(u);
    else if (user && event === 'SIGNED_OUT') { user = null; afterSignOut(); }
  });
  try { await signedIn(await cloud.currentUser()); } catch (e) { console.error(e); }
  if (!user && read(SIGNED_KEY)) { // the session ended elsewhere
    try { localStorage.removeItem(SIGNED_KEY); } catch (e) {}
  }
}

// the privacy policy lives on the website; inside the Android app open it in the browser
document.addEventListener('click', (e) => {
  const a = e.target.closest('.policy-link');
  if (a && NATIVE) { e.preventDefault(); openExternal(WEB_URL + 'privacy'); }
});

// Android back button: close a panel, leave practice, then exit
if (NATIVE) {
  onBackButton(() => {
    if (openSheets.length) closeSheet(openSheets[openSheets.length - 1]);
    else if (!$('practice').hidden) leavePractice();
    else exitApp();
  });
}

// ============ tap feedback ============
// a ripple spreads from the finger and a tiny tick, so every button feels pressable
const PRESSABLE = '.btn, .tile, .item-main, .naam, .chip, .find, .sadhana, .wall-tile, .wall-mini, .wall-card, .lib-row, .icon-btn, .option, .swatch, .fab, .segmented button, .account-btn, .lib-head';
document.addEventListener('pointerdown', (e) => {
  const el = e.target.closest(PRESSABLE);
  if (!el || el.disabled || el.closest('#ring')) return;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const r = el.getBoundingClientRect();
  const size = Math.hypot(Math.max(e.clientX - r.left, r.right - e.clientX), Math.max(e.clientY - r.top, r.bottom - e.clientY)) * 2;
  const rip = document.createElement('span');
  rip.className = 'tap-rip';
  rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.append(rip);
  setTimeout(() => rip.remove(), 600);
  if (el.id !== 'mainBtn') vibrate(6); // the count button has its own feel
}, { passive: true });

// ============ start ============
applyTheme();
applyI18n();
initAccounts();
if (NATIVE) {
  initAds(ADMOB_BANNER_ID, (h) => { adHeight = h; syncAds(); }).then(() => { $('adPrivacyBtn').hidden = !adPrivacyNeeded(); syncAds(); });
  $('adPrivacyBtn').onclick = showAdPrivacy;
}

// a shared link (?m=text&n=count&t=title) adds that mantra and opens it
const params = new URLSearchParams(location.search);
if (params.get('m')) {
  const text = params.get('m').trim().slice(0, 20000);
  if (text) {
    let it = st.items.find((i) => i.text === text);
    if (!it) { it = newItem(text, (params.get('t') || '').trim().slice(0, 80), clampCount(params.get('n'))); st.items.unshift(it); save(); }
    renderHome();
    openStart(it);
  }
  history.replaceState(null, '', location.pathname);
}

// lets automated tests drive the follow-voice path without a microphone
window.__mantraTest = { heard: (words) => onHeard(words), pos: () => P.pos };
