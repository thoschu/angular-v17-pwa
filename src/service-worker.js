const VERSION = 'v1';

self.addEventListener('install', event => {
  console.log('###');
  // const fn = async () => {
  //   const cache = await caches.open(`static-app-cache-${VERSION}`);
  //
  //   return await cache.put(request, response);
  // };
  //
  // event.waitUntil(fn());
});

self.addEventListener('activate', event => {
  console.log('***');
});

self.addEventListener('fetch', event => {
  console.log('...');
  // event.respondWith(async () => {});
});
