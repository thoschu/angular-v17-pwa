console.log('#####-A-#####');

if('serviceWorker' in navigator) {
  const serviceWorkerRegistration = window.navigator.serviceWorker.register('/service-worker.js', {
    scope: '/',
    //scope: '/api'
  });

  serviceWorkerRegistration.then( (registration) => {
      console.log('Service Worker Registered', registration);
    })
    .catch( (err) => {
      console.error('Service Worker Registration Failed', err);
    });
}
