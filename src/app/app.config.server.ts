import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      { maxResponseBodySize: 2 * 1024 * 1024 }, // 2MB cap on buffered SSR fetch responses
      withRoutes(serverRoutes),
    ),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
