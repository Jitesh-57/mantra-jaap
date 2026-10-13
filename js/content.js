// Wallpaper gallery.
// Images live in img/wallpapers/. An entry whose `src` is empty shows a
// placeholder in the deity's colours until the real picture is added.

export const DEITIES = {
  krishna:      { hi: 'कृष्ण जी',     mr: 'कृष्ण',        en: 'Krishna Ji',    sym: 'कृ', c: ['#1d4ed8', '#60a5fa'] },
  radhakrishna: { hi: 'राधे कृष्ण',  mr: 'राधे कृष्ण',   en: 'Radhe Krishna', sym: 'रा', c: ['#be185d', '#f9a8d4'] },
  shiv:         { hi: 'शिव जी',       mr: 'शिव',          en: 'Shiv Ji',       sym: 'ॐ', c: ['#1e293b', '#64748b'] },
  ganesh:       { hi: 'गणेश जी',      mr: 'गणपती बाप्पा', en: 'Ganesh Ji',     sym: 'ग', c: ['#c2410c', '#fdba74'] },
  hanuman:      { hi: 'हनुमान जी',    mr: 'हनुमान',       en: 'Hanuman Ji',    sym: 'ह', c: ['#b91c1c', '#fb923c'] },
  ram:          { hi: 'श्री राम',     mr: 'श्रीराम',      en: 'Shri Ram',      sym: 'रा', c: ['#047857', '#6ee7b7'] },
  durga:        { hi: 'दुर्गा माँ',    mr: 'दुर्गा माता',   en: 'Durga Maa',     sym: 'दु', c: ['#9f1239', '#fda4af'] },
  vitthal:      { hi: 'विठ्ठल',       mr: 'विठ्ठल',       en: 'Vitthal',       sym: 'वि', c: ['#3730a3', '#a5b4fc'] },
};

// `added` (YYYY-MM-DD) marks pictures as NEW for 30 days; `likes` orders the "Most liked" row.
export const GALLERY = [
  { id: 'krishna-1', deity: 'krishna', src: '', added: '2026-10-13', likes: 9 },
  { id: 'krishna-2', deity: 'krishna', src: '', added: '2026-10-13', likes: 4 },
  { id: 'krishna-3', deity: 'krishna', src: '', added: '2026-10-13', likes: 2 },
  { id: 'radhakrishna-1', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 8 },
  { id: 'radhakrishna-2', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 5 },
  { id: 'radhakrishna-3', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 1 },
  { id: 'shiv-1', deity: 'shiv', src: '', added: '2026-10-13', likes: 7 },
  { id: 'shiv-2', deity: 'shiv', src: '', added: '2026-10-13', likes: 3 },
  { id: 'shiv-3', deity: 'shiv', src: '', added: '2026-10-13', likes: 1 },
  { id: 'ganesh-1', deity: 'ganesh', src: '', added: '2026-10-13', likes: 6 },
  { id: 'ganesh-2', deity: 'ganesh', src: '', added: '2026-10-13', likes: 2 },
  { id: 'ganesh-3', deity: 'ganesh', src: '', added: '2026-10-13', likes: 1 },
  { id: 'hanuman-1', deity: 'hanuman', src: '', added: '2026-10-13', likes: 6 },
  { id: 'hanuman-2', deity: 'hanuman', src: '', added: '2026-10-13', likes: 2 },
  { id: 'ram-1', deity: 'ram', src: '', added: '2026-10-13', likes: 5 },
  { id: 'ram-2', deity: 'ram', src: '', added: '2026-10-13', likes: 1 },
  { id: 'durga-1', deity: 'durga', src: '', added: '2026-10-13', likes: 4 },
  { id: 'durga-2', deity: 'durga', src: '', added: '2026-10-13', likes: 1 },
  { id: 'vitthal-1', deity: 'vitthal', src: '', added: '2026-10-13', likes: 3 },
  { id: 'vitthal-2', deity: 'vitthal', src: '', added: '2026-10-13', likes: 1 },
];
