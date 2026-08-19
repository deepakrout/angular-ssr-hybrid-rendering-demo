# Angular SSR Hybrid Rendering Demo

A small, working Angular 21 application that demonstrates **hybrid rendering**
— mixing Server-Side Rendering (SSR), Static Site Generation (SSG /
prerendering), and Client-Side Rendering (CSR) in a single app, route by
route, plus **incremental hydration** and **event replay**.

This is the companion repo for the two-part *Angular SSR* tutorial series on
[habitualcs.io](https://habitualcs.io):

1. **Angular SSR Explained: Why It Exists, and What CSR Can't Do** — concepts,
   SSR vs. CSR, when to reach for each rendering mode.
2. **Building a Hybrid-Rendered Angular App: SSR, SSG, Hydration & Deploy**
   — this repo, walked through step by step, including incremental
   hydration and a production deployment checklist.

## What's in this repo

| Route | Render mode | Why |
|---|---|---|
| `/` | `RenderMode.Client` | No SEO or per-request need; ships as a CSR shell |
| `/about` | `RenderMode.Prerender` (SSG) | Static content, built once, served from cache/CDN |
| `/products` | `RenderMode.Server` | Needs fresh data (stock/pricing) on every request |
| `/products/:id` | `RenderMode.Server` | Per-product SSR; comments hydrate incrementally on viewport |

The rendering strategy for every route lives in one file:
[`src/app/app.routes.server.ts`](./src/app/app.routes.server.ts).

## Prerequisites

- Node.js 20.11+ (Node 22 LTS recommended)
- npm 10+
- Angular CLI 21 (`npm i -g @angular/cli`) — optional, npm scripts work without a global install

## Getting started

```bash
git clone https://github.com/deepakrout/angular-ssr-hybrid-rendering-demo.git
cd angular-ssr-hybrid-rendering-demo
npm install
```

### Run in dev mode (CSR dev server, fast iteration)

```bash
npm start
# http://localhost:4200
```

### Build and run the actual SSR server

This is the mode that matches production — it builds the browser bundle,
the server bundle, prerenders `/about`, and boots the Express/AngularAppEngine
server defined in `src/server.ts`.

```bash
npm run build
npm run serve:ssr
# http://localhost:4000
```

Open `view-source:` on `/products` and `/about` to confirm both are fully
rendered HTML on arrival, then open DevTools → Network to watch `/` render
blank-then-hydrate as a CSR route.

### Verify incremental hydration

1. Run the SSR build (above) and open `/products/1`.
2. In DevTools → Elements, note the Comments section is already present as
   static HTML.
3. In DevTools → Network → JS, notice the comments component's chunk is not
   requested until you scroll it into view — that's the `hydrate on viewport`
   trigger in [`product-detail.html`](./src/app/pages/product-detail/product-detail.html) firing.

## Project structure

```
src/
  app/
    app.config.ts            # Client providers: hydration, router, HttpClient
    app.config.server.ts     # Server providers: provideServerRendering + withRoutes
    app.routes.ts            # Standard Angular router config
    app.routes.server.ts     # Per-route render mode: Server / Client / Prerender
    components/comments/     # Incrementally-hydrated component
    pages/home/               # CSR route
    pages/about/               # Prerendered (SSG) route
    pages/products/            # SSR route (list)
    pages/product-detail/      # SSR route (detail) + @defer hydrate block
    services/product.service.ts
  server.ts                   # Express + AngularAppEngine request handler
  main.ts / main.server.ts    # Browser and server bootstrap entry points
```

## Notes on API versions

This project targets Angular 21 conventions (`@angular/ssr`'s
`provideServerRendering`/`withRoutes`/`ServerRoute`, and
`provideClientHydration` from `@angular/platform-browser`). If you're on an
older Angular version, check the `@angular/ssr` migration notes — the
server bootstrap package and a few provider names changed across v17–v21.

## License

MIT — use this freely as a starting point for your own SSR experiments.
