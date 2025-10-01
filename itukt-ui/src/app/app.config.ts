import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { environment } from '../environments/environment';
import { Configuration } from '@api/configuration';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // tilføj eventuelt withInterceptors(...) senere...
    ),
    {
      provide: Configuration,
      useFactory: () => new Configuration({ basePath: environment.apiBaseUrl }),
    }
  ]
};
