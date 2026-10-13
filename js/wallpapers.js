// God & goddess wallpapers, kept in the public Supabase Storage bucket "GodWallpapers".
// Pictures uploaded to the bucket appear in the app without an app update.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const WALL_BUCKET = 'GodWallpapers';
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;

export const wallUrl = (name) => `${SUPABASE_URL}/storage/v1/object/public/${WALL_BUCKET}/${name.split('/').map(encodeURIComponent).join('/')}`;

let cache = null;
/** All pictures in the bucket, newest first: [{ name, url, added }] */
export function listWallpapers() {
  if (!cache) {
    cache = fetch(`${SUPABASE_URL}/storage/v1/object/list/${WALL_BUCKET}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: '', limit: 1000, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),
    })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((rows) => rows.filter((f) => f.id && IMAGE.test(f.name)).map((f) => ({ name: f.name, url: wallUrl(f.name), added: f.created_at })))
      .catch((e) => { cache = null; throw e; });
  }
  return cache;
}
