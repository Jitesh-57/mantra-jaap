// Searching for prayers that are not in the library: open a Google search.
export const googleSearchUrl = (query) => 'https://www.google.com/search?q=' + encodeURIComponent(query + ' lyrics');
