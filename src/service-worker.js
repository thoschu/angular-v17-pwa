const VERSION = 'v5';

function log(...arguments) {
  console.log(`${VERSION}: `, ...arguments);
}

self.addEventListener('install', event => {
  log(`⭐ Service-Worker installed.`, event);
});

self.addEventListener('activate', event => {
  log(`📍 Service Worker activated.`, event);
});

// self.addEventListener('fetch', event => {
//   // const url = new URL(event.request.url);
//
//   log(`⭕ Service Worker fetched.`, event);
// });

log(`❎ Service-Worker registered.`);
