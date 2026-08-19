import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Signals-based zoneless change detection - pairs well with SSR because
    // there's no zone.js tax on the server render pass.
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    // Incremental hydration + event replay are on by default with
    // provideClientHydration() as of Angular 22; withEventReplay() kept here
    // explicitly for readers on Angular 19-21 where it must be opted into.
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
};
