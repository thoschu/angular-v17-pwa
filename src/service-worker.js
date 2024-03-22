const VERSION = 'v17';

function log(...arguments) {
  console.log(`${VERSION}: `, ...arguments);
}

self.addEventListener('install', event => {
  log(`⭐ Service-Worker installation started.`, event);
  const fn = async () => {
    const request = new Request('offline.html');
    const response = await fetch(request);

    log(`⭐⭐ Service-Worker installation process loading: offline.html.`, request);

    if(response.status !== 200) {
      log(`⭐⭐⭐ Service-Worker installation process stopped: offline.html.`, response);
      throw new Error(`Failed to load offline page: ${response.status}`, { cause: response.statusText });
    }

    log(`⭐⭐⭐ Service-Worker installation process loaded and cached: offline.html.`, response);

    const cache = await caches.open(`static-app-cache`);

    return await cache.put(request, response);
  };

  event.waitUntil(fn());
});

self.addEventListener('activate', event => {
  log(`📍 Service Worker activated.`, event);
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const fn = async () => {
    log(`⚠️ Service Worker is fetching: ${url}`, event);

    // let response = await fetch(event.request).catch(error => { });

    return await fetch(event.request)
      .then(res => {
        log(`⚠️ Service Worker fetched: ${url}`, event);

        return res;
      })
      .catch(async error => {
        log(`🛟 Service Worker is fetch failure: ${url}. Serving offline page`, error);

        const cache = await caches.open(`static-app-cache`);

        return cache.match('offline.html');
      });
  };

  event.respondWith(fn());
});

log(`❎ Service-Worker registered.`);
