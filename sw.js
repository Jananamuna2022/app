const CACHE_NAME = 'jananamuna-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/logo.png',
  '/Jananamuna.apk'
];

// Install event: Cache important files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files...');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => console.error('[Service Worker] Caching failed:', error))
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Cache first, then network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch error:', error);
      })
  );
});
