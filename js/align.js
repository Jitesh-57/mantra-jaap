/*
  Follow-voice engine.

  Speech recognisers spell Indian-language words inconsistently — कृष्ण may come
  back as क्रिष्ण, "krishna" or कृष्णा, and ं / न् / ः vary freely — and they often
  drop or merge short words. Matching each heard word on its own therefore jumps
  around. Instead every heard word is reduced to a rough phonetic key, and the
  whole run of words heard so far is aligned against the text (a small
  edit-distance style dynamic programme, like karaoke lyric sync). The reader's
  position is where that alignment ends.
*/

// ---------- phonetic keys ----------
const CONS = {
  'क': 'k', 'ख': 'k', 'ग': 'g', 'घ': 'g', 'ङ': 'n', 'च': 'c', 'छ': 'c', 'ज': 'j', 'झ': 'j', 'ञ': 'n',
  'ट': 't', 'ठ': 't', 'ड': 'd', 'ढ': 'd', 'ण': 'n', 'त': 't', 'थ': 't', 'द': 'd', 'ध': 'd', 'न': 'n',
  'प': 'p', 'फ': 'p', 'ब': 'b', 'भ': 'b', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'ळ': 'l', 'व': 'v',
  'श': 's', 'ष': 's', 'स': 's', 'ह': 'h', 'ऱ': 'r', 'ऴ': 'l',
  'क़': 'k', 'ख़': 'k', 'ग़': 'g', 'ज़': 'j', 'ड़': 'r', 'ढ़': 'r', 'फ़': 'p', 'य़': 'y',
};
const VOWELS = {
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri', 'ॠ': 'ri', 'ऌ': 'li',
  'ए': 'e', 'ऐ': 'e', 'ओ': 'o', 'औ': 'o', 'ऍ': 'e', 'ऑ': 'o', 'ऎ': 'e', 'ऒ': 'o',
};
const MATRAS = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'ॄ': 'ri', 'ॢ': 'li',
  'े': 'e', 'ै': 'e', 'ो': 'o', 'ौ': 'o', 'ॅ': 'e', 'ॉ': 'o', 'ॆ': 'e', 'ॊ': 'o',
};
const VIRAMA = '्', NUKTA = '़', ANUSVARA = 'ं', CHANDRABINDU = 'ँ', VISARGA = 'ः';
const DEVA_RE = /[ऀ-ॿ]/;
const LATIN_RE = /[a-z]/i;

function devaToLatin(word) {
  let out = '';
  let schwa = false; // a consonant whose inherent "a" is not yet written
  const flush = () => { if (schwa) { out += 'a'; schwa = false; } };
  for (const ch of word.normalize('NFC')) {
    if (ch === NUKTA) continue;
    if (CONS[ch]) { flush(); out += CONS[ch]; schwa = true; }
    else if (MATRAS[ch] !== undefined) { out += MATRAS[ch]; schwa = false; }
    else if (ch === VIRAMA) schwa = false;
    else if (ch === ANUSVARA || ch === CHANDRABINDU) { flush(); out += 'n'; }
    else if (ch === VISARGA) { flush(); out += 'h'; }
    else if (VOWELS[ch]) { flush(); out += VOWELS[ch]; }
    else if (ch === 'ॐ') { flush(); out += 'om'; }
    else flush();
  }
  // a final inherent "a" is not pronounced (राम → ram); recognisers agree
  return out;
}

function latinNorm(word) {
  let s = word.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z]/g, '');
  s = s.replace(/chh/g, 'c').replace(/sh/g, 's').replace(/ch/g, 'c').replace(/th/g, 't').replace(/dh/g, 'd')
    .replace(/bh/g, 'b').replace(/ph/g, 'p').replace(/kh/g, 'k').replace(/gh/g, 'g').replace(/jh/g, 'j')
    .replace(/x/g, 'ks').replace(/q/g, 'k').replace(/z/g, 'j').replace(/f/g, 'p').replace(/w/g, 'v')
    .replace(/ee|ii/g, 'i').replace(/oo|uu/g, 'u').replace(/aa/g, 'a').replace(/ai/g, 'e').replace(/au|ou/g, 'o');
  if (s.length > 2 && s.endsWith('a') && !/[aeiou]a$/.test(s)) s = s.slice(0, -1);
  return s;
}

const collapse = (s) => s.replace(/(.)\1+/g, '$1');

/** Phonetic key of one written or heard word; null for punctuation such as । ॥ ॥१॥ */
export function wordKey(word) {
  if (!word) return null;
  const w = word.trim();
  let full;
  if (DEVA_RE.test(w)) full = devaToLatin(w);
  else if (LATIN_RE.test(w.normalize('NFD'))) full = latinNorm(w);
  else full = w.normalize('NFD').toLowerCase().replace(/[\p{P}\p{S}\p{N}\p{M}\s]/gu, ''); // other scripts
  full = collapse(full);
  if (!full) return null;
  const cons = collapse(full.replace(/[aeiou]/g, '')) || full;
  return { full, cons };
}

function levRatio(a, b) {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = new Uint16Array(n + 1), cur = new Uint16Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const sub = prev[j - 1] + (ca === b.charCodeAt(j - 1) ? 0 : 1);
      const del = prev[j] + 1, ins = cur[j - 1] + 1;
      cur[j] = sub < del ? (sub < ins ? sub : ins) : (del < ins ? del : ins);
    }
    [prev, cur] = [cur, prev];
  }
  return 1 - prev[n] / Math.max(m, n);
}

/** 0..1 similarity of two keys; consonants weigh more because vowels are what recognisers get wrong */
export function similarity(a, b) {
  if (!a || !b) return 0;
  return 0.6 * levRatio(a.cons, b.cons) + 0.4 * levRatio(a.full, b.full);
}
const joinKeys = (a, b) => ({ full: a.full + b.full, cons: a.cons + b.cons });

// ---------- alignment ----------
const GAP_HEARD = -0.5;   // a heard word that is not in the text (noise, a mis-hearing)
const GAP_TEXT = -0.6;    // a text word that was not heard (dropped by the recogniser, or skipped)
function matchScore(s) {
  if (s >= 0.5) return 0.4 + (s - 0.5) * 4;   // 0.4 … 2.4
  if (s >= 0.35) return -0.4;
  return -1.2;
}
const MAX_SEGMENT = 28;   // heard words aligned at once; older ones are fixed in place
const KEEP_TAIL = 12;

/**
 * Tracks the reading position in `words` from a growing list of recognised words.
 * Feed it every recogniser update (interim results too) with all words heard in
 * the current recognition session; it is idempotent for repeated/revised input.
 */
export function createTracker(words) {
  const keys = words.map(wordKey);
  const real = [];                       // indices of words that can be spoken
  keys.forEach((k, i) => { if (k) real.push(i); });
  const N = real.length;

  let anchor = 0;    // index into `real` where the current segment starts
  let segStart = 0;  // index into the session's heard words where the segment starts
  let rpos = 0;      // index into `real` of the next word to read
  let stuck = 0;     // heard words since the position last moved
  let lastLen = 0;

  const keyCache = new Map();
  const simCache = new Map(); // "heard key|text index" → similarity
  const simAt = (h, idx) => {
    const c = h.full + '|' + idx;
    let v = simCache.get(c);
    if (v === undefined) { v = similarity(h, keys[idx]); if (simCache.size > 50000) simCache.clear(); simCache.set(c, v); }
    return v;
  };
  const hkey = (t) => {
    let k = keyCache.get(t);
    if (k === undefined) { k = wordKey(t); keyCache.set(t, k); }
    return k;
  };

  function align(H) {
    const m = H.length;
    const W = Math.min(N - anchor, m * 2 + 6);
    const cols = W + 1;
    const D = new Float32Array((m + 1) * cols);
    const P = new Uint8Array((m + 1) * cols); // 1 diag, 2 heard-gap, 3 text-gap, 4 two text words, 5 two heard words
    for (let j = 1; j <= W; j++) { D[j] = j * GAP_TEXT; P[j] = 3; }
    const tk = (j) => keys[real[anchor + j - 1]];
    const ti = (j) => real[anchor + j - 1];
    for (let i = 1; i <= m; i++) {
      const row = i * cols, up = (i - 1) * cols;
      D[row] = i * GAP_HEARD; P[row] = 2;
      const h = H[i - 1];
      for (let j = 1; j <= W; j++) {
        let best = D[up + j] + GAP_HEARD, p = 2;
        const left = D[row + j - 1] + GAP_TEXT;
        if (left > best) { best = left; p = 3; }
        if (h) {
          const d = D[up + j - 1] + matchScore(simAt(h, ti(j)));
          if (d > best) { best = d; p = 1; }
          if (j >= 2) { // the recogniser merged two written words into one
            const d2 = D[up + j - 2] + matchScore(similarity(h, joinKeys(tk(j - 1), tk(j)))) - 0.2;
            if (d2 > best) { best = d2; p = 4; }
          }
          if (i >= 2 && H[i - 2]) { // …or split one written word into two
            const d3 = D[(i - 2) * cols + j - 1] + matchScore(similarity(joinKeys(H[i - 2], h), tk(j))) - 0.2;
            if (d3 > best) { best = d3; p = 5; }
          }
        }
        D[row + j] = best; P[row + j] = p;
      }
    }
    let bj = 0, bs = D[m * cols];
    for (let j = 1; j <= W; j++) if (D[m * cols + j] > bs + 1e-6) { bs = D[m * cols + j]; bj = j; }
    // walk the best path back: path[i] = text column reached once i heard words are used
    const path = new Int32Array(m + 1);
    let i = m, j = bj;
    path[m] = bj;
    while (i > 0 || j > 0) {
      const p = P[i * cols + j];
      if (p === 1) { i--; j--; }
      else if (p === 2) i--;
      else if (p === 3) j--;
      else if (p === 4) { i--; j -= 2; }
      else { path[i - 1] = j - 1; i -= 2; j--; }
      path[i] = j;
    }
    return { end: bj, gain: bs - D[m * cols], path, W };
  }

  // Lost our place (skipped ahead, or started again from the top): look for the
  // last few heard words anywhere in the text.
  function relocate(H) {
    const tail = H.slice(-4).filter(Boolean);
    if (tail.length < 3) return -1;
    let best = -1, bestScore = 0;
    for (let s = 0; s < N; s++) {
      let score = 0, j = s;
      for (const h of tail) {
        let local = 0, lj = j;
        for (let d = 0; d < 2 && j + d < N; d++) {
          const v = simAt(h, real[j + d]);
          if (v > local) { local = v; lj = j + d; }
        }
        score += local; j = lj + 1;
      }
      score /= tail.length;
      if (score > bestScore) { bestScore = score; best = j; }
    }
    return bestScore >= 0.72 ? Math.min(best, N) : -1;
  }

  return {
    /** number of speakable words */
    get length() { return N; },
    /** index into the original `words` of the next word to read (words.length when finished) */
    get pos() { return rpos < N ? real[rpos] : words.length; },

    /**
     * @param heard all words recognised in this session so far
     * @param autoWrap when the end is reached, count it and continue from the start
     * @returns number of completed recitations found in this update
     */
    update(heard, autoWrap) {
      let completed = 0;
      if (heard.length < segStart) segStart = heard.length; // the recogniser revised words away
      const grew = heard.length - lastLen;
      lastLen = heard.length;
      for (let guard = 0; guard < 50; guard++) {
        const H = heard.slice(segStart).map(hkey);
        if (!H.length || anchor >= N) {
          if (anchor >= N && autoWrap) { completed++; anchor = 0; rpos = 0; continue; }
          break;
        }
        const r = align(H);
        const before = rpos;
        rpos = r.gain > 0 ? anchor + r.end : anchor;
        if (rpos >= N && autoWrap) {
          // the heard word that completed the text; the rest belong to the next recitation
          let k = H.length;
          while (k > 0 && r.path[k - 1] >= r.W) k--;
          completed++;
          segStart += k; anchor = 0; rpos = 0; stuck = 0;
          continue;
        }
        if (rpos > before) stuck = 0; else if (grew > 0) stuck += grew;
        if (stuck >= 5) {
          const at = relocate(H);
          if (at >= 0 && at !== rpos) {
            anchor = at; rpos = at; segStart = heard.length; stuck = 0;
            if (rpos >= N && autoWrap) { completed++; anchor = 0; rpos = 0; }
            break;
          }
        }
        // keep the alignment small on long prayers: fix older words in place
        if (H.length > MAX_SEGMENT) {
          const cut = H.length - KEEP_TAIL;
          anchor += r.path[cut]; segStart += cut;
        }
        break;
      }
      return completed;
    },

    /** a new recognition session starts (its word list begins empty again) */
    newSession() { segStart = 0; lastLen = 0; anchor = rpos; stuck = 0; },
    /** the reader tapped a word, or the count moved on: continue from there */
    jumpTo(wordIndex, heardLength = 0) {
      let r = real.findIndex((i) => i >= wordIndex);
      if (r < 0) r = N;
      anchor = rpos = r; segStart = heardLength; lastLen = heardLength; stuck = 0;
    },
    /** true when only the last word is left (used to finish after a pause) */
    get atLastWord() { return rpos === N - 1; },
    finish(heardLength = 0) { anchor = rpos = N; segStart = heardLength; },
  };
}
