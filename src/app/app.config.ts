import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandlingInterceptor } from '../shared/interceptors/error-handling.interceptor';
import { MessageService } from 'primeng/api';
import { TokenHandlingInterceptor } from '../shared/interceptors/token-handling.interceptor';
import { AuthGuard } from '../guard/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenHandlingInterceptor,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
};