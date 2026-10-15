/* Increase this value whenever a shipped app asset changes. */
const CACHE_NAME = 'english-practice-v1';
const CORE_FILES = [
  './', './index.html', './style.css', './manifest.webmanifest',
  './js/words.js', './js/storage.js', './js/quiz.js', './js/speech.js',
  './js/import-export.js', './js/app.js', './js/pwa.js',
  './data/sample-words.csv', './icons/icon.svg', './icons/icon-192.svg',
  './icons/icon-512.svg', './icons/icon-maskable.svg', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('english-practice-') && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  // Cache only the app shell and explicitly listed assets. Never cache requests
  // with queries or arbitrary app/data URLs (including imported user content).
  if (url.search || url.hash) return;
  const scope = new URL(self.registration.scope);
  if (!url.pathname.startsWith(scope.pathname)) return;
  const rel = './' + url.pathname.slice(scope.pathname.length);
  if (!CORE_FILES.includes(rel) && rel !== './') return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(new URL('./index.html', scope), response.clone()));
      return response;
    }).catch(async () => (await caches.match(new URL('./index.html', scope))) || (await caches.match(new URL('./', scope)))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && CORE_FILES.includes(rel)) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
