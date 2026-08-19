import { RenderMode, ServerRoute } from '@angular/ssr';

// This file is the crux of "hybrid rendering": every route in app.routes.ts
// gets an explicit rendering strategy here. Nothing is implicit.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    // The homepage has no per-user data, but it does change often enough
    // (e.g. featured items) that we render it on the client after an
    // initial static shell — good for demoing pure CSR inside a hybrid app.
    renderMode: RenderMode.Client,
  },
  {
    path: 'about',
    // Static marketing-style content: build it once, serve it from a CDN.
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products',
    // Product list can change (stock, pricing) — render per request on the server.
    renderMode: RenderMode.Server,
  },
  {
    path: 'products/:id',
    // Product detail is also per-request SSR. See Part 2 of the blog series
    // for a getPrerenderParams() variant that pre-builds the top N products
    // at build time and falls back to SSR for the long tail.
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
