// Searching prayers on the internet: Wikisource, the free library of
// public-domain texts. Its API allows requests from any site (origin=*).

// Which Wikisource to search for each prayer language
const WIKI_FOR = {
  sa: 'sa', hi: 'hi', mr: 'mr', ne: 'hi', gu: 'gu', bn: 'bn', pa: 'pa',
  or: 'or', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml', en: 'en', pra: 'hi',
};
export const wikiFor = (lang) => WIKI_FOR[lang] || 'hi';

const api = (wiki, params) =>
  `https://${wiki}.wikisource.org/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params });

function plain(html) {
  const d = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Find pages whose title or text matches the query. */
export async function searchOnline(query, wiki, signal) {
  const res = await fetch(api(wiki, { action: 'query', list: 'search', srsearch: query, srlimit: '12', srnamespace: '0', srprop: 'snippet|size' }), { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.info || 'search failed');
  return (data.query?.search || [])
    .filter((r) => r.size > 40) // skip empty stubs
    .map((r) => ({ wiki, title: r.title, snippet: plain(r.snippet || '') }));
}

/** Load one page and turn it into clean prayer text (lines kept, notes and navigation removed). */
export async function fetchOnlineText(wiki, title, signal) {
  const res = await fetch(api(wiki, { action: 'parse', page: title, prop: 'text', redirects: '1', disableeditsection: '1', disabletoc: '1' }), { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error.info || 'page not found');
  return { title: data.parse?.title || title, text: htmlToText(data.parse?.text || '') };
}

export function htmlToText(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  doc.querySelectorAll([
    'style', 'script', 'sup.reference', '.reference', '.references', '.mw-references-wrap', '.reflist',
    '.noprint', '.mw-editsection', '.navbox', '.metadata', '.ws-noexport', '.ws-header', '#headertemplate',
    '.header_box', 'table.header', '.licenseContainer', '.mw-empty-elt', '.catlinks', '.toc', '.thumb', 'figure', 'img',
  ].join(',')).forEach((n) => n.remove());
  doc.querySelectorAll('br').forEach((b) => b.replaceWith('\n'));
  doc.querySelectorAll('p, div, li, dd, dt, tr, pre, h1, h2, h3, h4, h5, h6, blockquote, center, poem').forEach((el) => el.append('\n'));
  return (doc.body.textContent || '')
    .replace(/ /g, ' ')
    .replace(/\[\d+\]/g, '')            // footnote markers
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const googleSearchUrl = (query) => 'https://www.google.com/search?q=' + encodeURIComponent(query + ' lyrics');
