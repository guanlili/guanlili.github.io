// lili Blog — Service Worker
// Cache-first for static assets, network-first for HTML, stale-while-revalidate for search index.

var CACHE = 'lili-blog-v2';
var PRECACHE = [
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
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (cached) {
          return cached || caches.match('/');
        });
      })
    );
    return;
  }

  // Pagefind search index: stale-while-revalidate.
  if (path.indexOf('/pagefind/') === 0) {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        return c.match(e.request).then(function (cached) {
          var fetchPromise = fetch(e.request).then(function (res) {
            if (res && res.ok) c.put(e.request, res.clone());
            return res;
          }).catch(function () { return cached; });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Static assets: cache-first.
  var isStatic = CACHE_FIRST.some(function (prefix) { return path.indexOf(prefix) === 0; });
  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        return fetch(e.request).then(function (res) {
          if (res && res.ok) {
            var clone = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
          }
          return res;
        }).catch(function () {
          return Response.error();
        });
      })
    );
    return;
  }
});
