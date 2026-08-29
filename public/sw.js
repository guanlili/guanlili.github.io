// lili Blog — Service Worker
// Cache-first for static assets, network-first for HTML,
// stale-while-revalidate for search index & COS images.

var VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
var CACHE = 'lili-blog-' + VERSION;

var PRECACHE = [
  '/',
  '/offline/',
  '/js/site.js',
  '/search-catalog.json',
  '/img/favicon.ico',
  '/img/avatar-ghl-ny.jpg',
];

// Same-origin prefixes served cache-first.
var CACHE_FIRST = [
  '/js/',
  '/pwa/',
  '/img/',
  '/data/',
  '/_astro/',
];

// Cross-origin hosts served stale-while-revalidate.
var CDN_HOSTS = [
  'blog-1258476669.cos.ap-beijing.myqcloud.com',
];

var MAX_CACHE_ENTRIES = 200;

// ── Helpers ────────────────────────────────────────────────────

async function cacheOk(request, response) {
  if (response && response.ok) {
    var cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

// Trim cache to prevent unbounded growth.
async function trimCache() {
  var cache = await caches.open(CACHE);
  var keys = await cache.keys();
  if (keys.length <= MAX_CACHE_ENTRIES) return;
  // Delete oldest entries beyond the limit.
  var excess = keys.length - MAX_CACHE_ENTRIES;
  for (var i = 0; i < excess; i++) {
    await cache.delete(keys[i]);
  }
}

// ── Strategies ─────────────────────────────────────────────────

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
    // Graceful offline fallback instead of a broken Response.error()
    return await caches.match('/offline/') || new Response('', { status: 503, statusText: 'Offline' });
  }
}

// ── Lifecycle ──────────────────────────────────────────────────

// Install: pre-cache the shell.
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches & trim current cache.
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    }).then(trimCache)
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────────

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);
  var sameOrigin = url.origin === self.location.origin;

  // Cross-origin CDN images: stale-while-revalidate (no-cors).
  if (!sameOrigin) {
    if (CDN_HOSTS.indexOf(url.host) !== -1 && url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      e.respondWith(staleWhileRevalidate(e.request));
    }
    return;
  }

  var path = url.pathname;
  var accept = e.request.headers.get('accept') || '';

  // HTML pages: network-first (always fresh content).
  if (accept.indexOf('text/html') !== -1) {
    e.respondWith(networkFirstHtml(e.request));
    return;
  }

  // Pagefind search index & catalog: stale-while-revalidate.
  if (path.indexOf('/pagefind/') === 0 || path === '/search-catalog.json') {
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
