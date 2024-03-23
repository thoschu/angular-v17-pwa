import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then((): void => {
    if('serviceWorker' in navigator) {
      const serviceWorkerRegistration: Promise<ServiceWorkerRegistration> =
        window.navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });

      serviceWorkerRegistration
        .then((registration: ServiceWorkerRegistration): void => {
          console.log('→ Service-Worker Registration completed.', registration);
        })
        .catch((err: Error): void => {
          console.error('→ Service-Worker Registration Failed.', err);
        });
    }
  })
  .catch((err: Error) => console.error(err));
