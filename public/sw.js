// lili Blog — Service Worker
// Cache-first for static assets, network-first for HTML, stale-while-revalidate for search index.

var CACHE = 'lili-blog-v3';
var PRECACHE = [
  '/',
  '/offline/',
  '/js/site.js',
  '/img/favicon.ico',
  '/img/avatar-ghl-ny.jpg'
];

// Static assets: cache on first request, serve from cache thereafter.
var CACHE_FIRST = [
  '/js/site.js',
  '/pwa/',
  '/img/',
  '/_astro/'
];

async function cacheOk(request, response) {
  if (response && response.ok) {
    var cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstHtml(request) {
  try {
    return await cacheOk(request, await fetch(request));
  } catch {
    return await caches.match(request) || await caches.match('/offline/') || await caches.match('/');
  }
}

async function staleWhileRevalidate(request) {
  var cache = await caches.open(CACHE);
  var cached = await cache.match(request);
  var fresh = fetch(request)
    .then(function (res) { return cacheOk(request, res); })
    .catch(function () { return cached; });
  return cached || fresh;
}

async function cacheFirst(request) {
  var cached = await caches.match(request);
  if (cached) return cached;
  try {
    return await cacheOk(request, await fetch(request));
  } catch {
    return Response.error();
  }
}

// Install: pre-cache the shell.
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches.
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  // Only handle same-origin requests.
  if (url.origin !== self.location.origin) return;

  var path = url.pathname;
  var accept = e.request.headers.get('accept') || '';

  // HTML pages: network-first (always fresh content).
  if (accept.indexOf('text/html') !== -1) {
    e.respondWith(networkFirstHtml(e.request));
    return;
  }

  // Pagefind search index: stale-while-revalidate.
  if (path.indexOf('/pagefind/') === 0) {
    e.respondWith(staleWhileRevalidate(e.request));
    return;
  }

  // Static assets: cache-first.
  var isStatic = CACHE_FIRST.some(function (prefix) { return path.indexOf(prefix) === 0; });
  if (isStatic) {
    e.respondWith(cacheFirst(e.request));
    return;
  }
});
