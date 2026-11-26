// lili Blog — Service Worker
// Cache-first for static assets, network-first for HTML,
// stale-while-revalidate for search index & COS images.

var VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
var CACHE = 'lili-blog-' + VERSION;
// COS image URLs never change content, so this cache is not versioned and
// survives deploys. Kept small: Chrome pads each opaque response to ~7 MB of
// quota, and cross-origin images without CORS are always opaque.
var IMG_CACHE = 'lili-blog-cos-img';

var PRECACHE = [
  '/',
  '/offline/',
  '/search-catalog.json',
  '/img/favicon.ico',
  '/img/avatar-ghl-ny.jpg',
];

// Same-origin prefixes served cache-first. Changing any file under the
// un-fingerprinted ones changes VERSION (see src/lib/asset-version.ts).
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

var LIMITS = {};
LIMITS[CACHE] = 200;
LIMITS[IMG_CACHE] = 60;

// ── Helpers ────────────────────────────────────────────────────

var trimPending = {};

// Trim a cache to its limit, oldest entries first. Debounced so a burst of
// puts (e.g. an image-heavy article) triggers one pass.
function scheduleTrim(name) {
  if (trimPending[name]) return;
  trimPending[name] = setTimeout(function () {
    trimPending[name] = null;
    trimCache(name);
  }, 2000);
}

async function trimCache(name) {
  var cache = await caches.open(name);
  var keys = await cache.keys();
  var excess = keys.length - LIMITS[name];
  for (var i = 0; i < excess; i++) {
    await cache.delete(keys[i]);
  }
}

async function cacheOk(name, request, response) {
  var cacheable = response && (response.ok || (name === IMG_CACHE && response.type === 'opaque'));
  if (cacheable) {
    try {
      var cache = await caches.open(name);
      await cache.put(request, response.clone());
      scheduleTrim(name);
    } catch {
      // Quota exceeded (e.g. private browsing): serve uncached.
    }
  }
  return response;
}

// ── Strategies ─────────────────────────────────────────────────

async function networkFirstHtml(request) {
  try {
    return await cacheOk(CACHE, request, await fetch(request));
  } catch {
    return await caches.match(request) || await caches.match('/offline/') || await caches.match('/');
  }
}

async function staleWhileRevalidate(name, request) {
  var cache = await caches.open(name);
  var cached = await cache.match(request);
  var fresh = fetch(request)
    .then(function (res) { return cacheOk(name, request, res); })
    .catch(function () { return cached; });
  return cached || fresh;
}

async function cacheFirst(request) {
  var cached = await caches.match(request);
  if (cached) return cached;
  try {
    return await cacheOk(CACHE, request, await fetch(request));
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

// Activate: clean old versioned caches & trim the rest.
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE && k !== IMG_CACHE; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return Promise.all([trimCache(CACHE), trimCache(IMG_CACHE)]);
    })
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────────

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);
  var sameOrigin = url.origin === self.location.origin;

  // Cross-origin CDN images: stale-while-revalidate (no-cors → opaque).
  if (!sameOrigin) {
    if (CDN_HOSTS.indexOf(url.host) !== -1 && url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      e.respondWith(staleWhileRevalidate(IMG_CACHE, e.request));
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
    e.respondWith(staleWhileRevalidate(CACHE, e.request));
    return;
  }

  // Static assets: cache-first.
  var isStatic = CACHE_FIRST.some(function (prefix) { return path.indexOf(prefix) === 0; });
  if (isStatic) {
    e.respondWith(cacheFirst(e.request));
  }
});
