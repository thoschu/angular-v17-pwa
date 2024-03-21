const VERSION = 'v1';

function log(...arguments) {
  console.log(VERSION, arguments);
}

log('Service Worker: Registered');
