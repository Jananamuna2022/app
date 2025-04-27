const CACHE_NAME = 'jananamuna-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/logo.png',
  // REMOVE APK from cache list ❌
];

// Install event: caching files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event: cleaning old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
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

// Fetch event: cache first, but bypass for .apk files
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.apk')) {
    console.log('[Service Worker] Skipping cache for APK');
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
