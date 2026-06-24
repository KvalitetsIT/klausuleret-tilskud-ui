import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { environment } from '../environments/environment';
import { Configuration as ManagementConfiguration } from '@api/configuration';
import { Configuration as GatewayConfiguration } from '@gateway/configuration';
import { ClauseService } from './services/clause-service';
import { CachedClauseService } from './services/cached-clause-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // tilføj eventuelt withInterceptors(...) senere...
    ),
    {
      provide: ManagementConfiguration,
      useFactory: () => new ManagementConfiguration({ basePath: environment.authGatewayUrl + '/gateway/api', withCredentials: true }),
    },
    {
      provide: GatewayConfiguration,
      useFactory: () => new GatewayConfiguration({ basePath: environment.authGatewayUrl, withCredentials: true }),
    },
    {
      provide: ClauseService,
      useExisting: CachedClauseService,
    },
  ]
};
