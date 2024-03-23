const VERSION = 'v0.0.18';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(`static-app-cache-${VERSION}`)
      .then(cache => cache.addAll([
        '/',
        '/styles.css',
        '/polyfills.js',
        '/main.js',
        '/manifest.webmanifest',
        '/favicon.ico',
        '/media/dashboard.gif',
        '/lorem-ipsum',
        '/assets/icons/'
    ]))
  );
});

self.addEventListener('activate',event => {
  console.log('***');
});

self.addEventListener('fetch', event => {
  const fn = async () => {
    const cache = await caches.open(`static-app-cache-${VERSION}`);
    const cachedResponse = await cache.match(event.request);

    if(cachedResponse) {
      console.log(`📍 from cache: ${event.request.url}`, cachedResponse);

      return cachedResponse;
    }

    return await fetch(event.request)
      .then(response => {
        console.log(`⭐ from network: ${event.request.url}`, response);

        return response;
      })
      .catch(async error => console.error(error));
  };

  event.respondWith(fn());
});
