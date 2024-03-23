const VERSION = 'v0.0.19';

const CACHE_NAME = `static-app-cache-${VERSION}`;

self.addEventListener('install', event => {
  console.log(`🔔 service worker ${VERSION} installed`, event);

  event.waitUntil(
    self.caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/styles.css',
        '/polyfills.js',
        '/main.js',
        '/manifest.webmanifest',
        '/favicon.ico',
        '/media/dashboard.gif',
        '/profile'
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate',async event => {
  console.log(`❗ service worker ${VERSION} activated`, event);

  const cacheKeys = await self.caches.keys();

  cacheKeys.forEach(key => {
    if(key !== CACHE_NAME) {
      caches.delete(key);
    }
  });

  return self.clients.claim(); // early activation of service worker
});

self.addEventListener('fetch', event => {
  const fn = async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if(cachedResponse) {
      console.log(`⭐ from service worker ${VERSION} cache: ${event.request.url}`, cachedResponse);

      return cachedResponse;
    }

    return await fetch(event.request)
      .then(response => {
        console.log(`📍 from service worker ${VERSION} network: ${event.request.url}`, response);

        return response;
      })
      .catch(async error => console.error(error));
  };

  event.respondWith(fn());
});
