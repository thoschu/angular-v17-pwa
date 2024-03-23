const VERSION = 'v0.0.8';

const CACHE_NAME = `static-app-cache-${VERSION}`;

self.addEventListener('install', event => {
  console.log(`🔔 service worker ${VERSION} installed`, event);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/styles.css',
        '/polyfills.js',
        '/main.js',
        '/manifest.webmanifest',
        '/favicon.ico',
        '/media/dashboard.gif'
    ]))
  );
});

self.addEventListener('activate',async event => {
  console.log(`❗ service worker ${VERSION} activated`, event);

  const cacheKeys = await caches.keys();

  cacheKeys.forEach(key => {
    if(key !== CACHE_NAME) {
      caches.delete(key);
    }
  });
});

self.addEventListener('fetch', event => {
  const fn = async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if(cachedResponse) {
      console.log(`⭐ from cache: ${event.request.url}`, cachedResponse);

      return cachedResponse;
    }

    return await fetch(event.request)
      .then(response => {
        console.log(`📍 from network: ${event.request.url}`, response);

        return response;
      })
      .catch(async error => console.error(error));
  };

  event.respondWith(fn());
});
