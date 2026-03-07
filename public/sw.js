const CACHE_NAME = 'aquavolt-v1';
const STATIC_CACHE = 'aquavolt-static-v1';
const IMAGE_CACHE = 'aquavolt-images-v1';

// Static assets to precache
const PRECACHE_URLS = [
  '/',
  '/favicon.ico',
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, STATIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API/supabase calls — always network
  if (url.pathname.startsWith('/rest/') || 
      url.pathname.startsWith('/functions/') ||
      url.hostname.includes('supabase')) return;

  // Images: cache-first with long TTL
  if (request.destination === 'image' || 
      url.pathname.match(/\.(webp|jpg|jpeg|png|svg|gif|ico)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // JS/CSS: stale-while-revalidate
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css)$/i)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // HTML: network-first with cache fallback
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Fonts: cache-first
  if (request.destination === 'font' || url.hostname.includes('fonts')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }
});
