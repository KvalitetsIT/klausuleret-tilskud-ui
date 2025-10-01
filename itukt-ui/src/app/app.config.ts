import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { environment } from '../environments/environment';
import { ApiConfiguration } from '@api/api-configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // tilføj eventuelt withInterceptors(...) senere...
    ),
    { provide: ApiConfiguration, useValue: { rootUrl: environment.apiBaseUrl } }
  ]
};
