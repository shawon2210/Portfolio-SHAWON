import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Canonical deployment origin.
 *
 * Single source of truth: overridable per build, no trailing slash. `src/config/site.ts`
 * mirrors this for runtime code so TS and static files can never disagree.
 */
const SITE_ORIGIN = (process.env.SITE_ORIGIN ?? 'https://shawon-portfolio-green.vercel.app').replace(
  /\/+$/,
  '',
);

/** Public text files that reference the origin and must be token-substituted. */
const ORIGIN_PUBLIC_FILES = new Set([
  'llms.txt',
  'robots.txt',
  'sitemap.xml',
  'og-image.template.html',
]);

const ORIGIN_TOKEN = /%SITE_ORIGIN%/g;

const MIME: Record<string, string> = {
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
};

/**
 * Substitutes the `%SITE_ORIGIN%` token in `index.html` and the SEO files under
 * `public/`, so the origin is declared exactly once in `vite.config.ts`.
 */
function siteOriginPlugin(): Plugin {
  const substitute = (source: string): string => source.replace(ORIGIN_TOKEN, SITE_ORIGIN);
  let outDir = 'dist';

  return {
    name: 'site-origin',
    configResolved(config) {
      outDir = path.resolve(config.root ?? process.cwd(), config.build.outDir);
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return substitute(html);
      },
    },
    // `public/` files are copied verbatim after the bundle is generated, so they never
    // appear in `generateBundle`. Rewrite them on disk once the build has written dist.
    closeBundle() {
      for (const name of ORIGIN_PUBLIC_FILES) {
        const file = path.join(outDir, name);
        if (!fs.existsSync(file)) continue;
        const source = fs.readFileSync(file, 'utf8');
        if (!ORIGIN_TOKEN.test(source)) {
          ORIGIN_TOKEN.lastIndex = 0;
          continue;
        }
        ORIGIN_TOKEN.lastIndex = 0;
        fs.writeFileSync(file, substitute(source), 'utf8');
      }
    },
    // In dev, public files are served straight from disk; rewrite them in-flight.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requested = decodeURIComponent((req.url ?? '').split('?')[0] ?? '')
          .split('/')
          .filter(Boolean)
          .pop();
        if (!requested || !ORIGIN_PUBLIC_FILES.has(requested)) return next();

        const file = path.resolve(__dirname, 'public', requested);
        if (!fs.existsSync(file)) return next();

        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'text/plain; charset=utf-8');
        res.end(substitute(fs.readFileSync(file, 'utf8')));
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), siteOriginPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three')) {
                return 'three-vendor';
              }
              if (id.includes('motion')) {
                return 'motion-vendor';
              }
              if (id.includes('lucide-react')) {
                return 'lucide-vendor';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
