// Listen: mantras, bhajans and aartis from the public Supabase Storage bucket "BhaktiAudio"
// (folders Mantra/, Bhajan/, Aarti/). Uploads appear in the app without an update.
// Playback keeps going with the screen locked: the browser's Media Session on the web,
// and a media-playback service (lock-screen and notification controls) in the Android app.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const AUDIO_BUCKET = 'BhaktiAudio';
export const AUDIO_KINDS = ['Mantra', 'Bhajan', 'Aarti'];
const AUDIO = /\.(mp3|m4a|aac|ogg|oga|opus|wav|webm)$/i;

const fileUrl = (path) => `${SUPABASE_URL}/storage/v1/object/public/${AUDIO_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
export const trackTitle = (name) => name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

const lists = {};
/** Tracks in one folder, newest first: [{ name, title, kind, url }] */
export function listTracks(kind) {
  if (!lists[kind]) {
    lists[kind] = fetch(`${SUPABASE_URL}/storage/v1/object/list/${AUDIO_BUCKET}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: kind + '/', limit: 1000, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),
    })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((rows) => rows.filter((f) => f.id && AUDIO.test(f.name))
        .map((f) => ({ name: f.name, title: trackTitle(f.name), kind, url: fileUrl(`${kind}/${f.name}`) })))
      .catch((e) => { delete lists[kind]; throw e; });
  }
  return lists[kind];
}

// ----- the player -----
const audio = new Audio();
audio.preload = 'auto';
const MS = window.Capacitor?.isNativePlatform?.() && typeof window.Capacitor.registerPlugin === 'function'
  ? (() => { try { return window.Capacitor.registerPlugin('MediaSession'); } catch (e) { return null; } })()
  : null;
const webMS = !MS && 'mediaSession' in navigator ? navigator.mediaSession : null;

export const player = {
  queue: [], index: -1, repeat: 'off', // 'off' | 'one' | 'all'
  listeners: new Set(),
  get track() { return this.queue[this.index] || null; },
  get playing() { return !audio.paused && !audio.ended; },
  get time() { return audio.currentTime || 0; },
  get duration() { return Number.isFinite(audio.duration) ? audio.duration : 0; },
  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit() { for (const fn of this.listeners) fn(this); },

  play(queue, index) {
    this.queue = queue; this.index = index;
    audio.src = this.track.url;
    audio.play().catch((e) => { console.error(e); this.emit(); });
    setMeta(this.track);
    this.emit();
  },
  toggle() {
    if (!this.track) return;
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  },
  next(auto) {
    if (!this.queue.length) return;
    if (this.index < this.queue.length - 1) this.play(this.queue, this.index + 1);
    else if (this.repeat === 'all' || !auto) this.play(this.queue, 0);
    else { audio.pause(); this.emit(); }
  },
  prev() {
    if (!this.queue.length) return;
    if (audio.currentTime > 4) { audio.currentTime = 0; return; } // like music apps: first back = start of the track
    this.play(this.queue, (this.index - 1 + this.queue.length) % this.queue.length);
  },
  seek(t) { if (this.duration) audio.currentTime = Math.max(0, Math.min(this.duration, t)); },
  cycleRepeat() { this.repeat = this.repeat === 'off' ? 'all' : this.repeat === 'all' ? 'one' : 'off'; audio.loop = this.repeat === 'one'; this.emit(); },
  stop() {
    audio.pause(); audio.removeAttribute('src'); audio.load();
    this.queue = []; this.index = -1;
    setState('none');
    this.emit();
  },
};

audio.addEventListener('play', () => { setState('playing'); player.emit(); });
audio.addEventListener('pause', () => { setState(player.track ? 'paused' : 'none'); player.emit(); });
audio.addEventListener('ended', () => { if (player.repeat !== 'one') player.next(true); });
audio.addEventListener('timeupdate', () => { player.emit(); setPosition(); });
audio.addEventListener('loadedmetadata', () => { player.emit(); setPosition(); });
audio.addEventListener('error', () => player.emit());

// ----- lock screen and notification controls -----
const ART = [{ src: new URL('img/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }];
function setMeta(tr) {
  const meta = { title: tr.title, artist: 'JapSadhna', album: tr.kind, artwork: ART };
  if (MS) MS.setMetadata(meta).catch(() => {});
  else if (webMS && window.MediaMetadata) webMS.metadata = new MediaMetadata(meta);
}
function setState(s) {
  if (MS) MS.setPlaybackState({ playbackState: s }).catch(() => {});
  else if (webMS) webMS.playbackState = s;
}
let lastPos = 0;
function setPosition() {
  if (!player.duration || Date.now() - lastPos < 1000) return;
  lastPos = Date.now();
  const st = { duration: player.duration, position: Math.min(player.time, player.duration), playbackRate: audio.playbackRate || 1 };
  if (MS) MS.setPositionState(st).catch(() => {});
  else if (webMS?.setPositionState) { try { webMS.setPositionState(st); } catch (e) { /* ignore */ } }
}
const handlers = {
  play: () => audio.play().catch(() => {}),
  pause: () => audio.pause(),
  nexttrack: () => player.next(),
  previoustrack: () => player.prev(),
  seekto: (d) => d?.seekTime != null && player.seek(d.seekTime),
  stop: () => player.stop(),
};
for (const [action, fn] of Object.entries(handlers)) {
  if (MS) { try { Promise.resolve(MS.setActionHandler({ action }, fn)).catch(() => {}); } catch (e) { /* ignore */ } }
  else if (webMS) { try { webMS.setActionHandler(action, fn); } catch (e) { /* not supported */ } }
}
