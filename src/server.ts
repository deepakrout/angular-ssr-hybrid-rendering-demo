import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularAppEngine();

// Serve static files with long cache lifetimes; index.html is handled by Angular.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Example API route that the product pages call during SSR and CSR alike.
app.get('/api/products', (_req, res) => {
  res.json([
    { id: '1', name: 'Mechanical Keyboard', price: 129, description: 'Hot-swappable, tactile switches, USB-C.' },
    { id: '2', name: 'Ultrawide Monitor', price: 749, description: '34" curved, 144Hz, great for split-pane coding.' },
    { id: '3', name: 'Standing Desk', price: 399, description: 'Electric height adjust, memory presets.' },
  ]);
});

// All other requests are handled by the Angular SSR/SSG/CSR router.
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

async function writeResponseToNodeResponse(response: Response, res: express.Response) {
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (response.body) {
    const reader = response.body.getReader();
    const pump = async (): Promise<void> => {
      const { done, value } = await reader.read();
      if (done) return res.end();
      res.write(value);
      return pump();
    };
    await pump();
  } else {
    res.end();
  }
}

const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Node server listening on http://localhost:${port}`);
});

export const reqHandler = createRequestHandler(app);
