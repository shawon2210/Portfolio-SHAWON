import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const portfolioSrc = fileURLToPath(new URL('../src', import.meta.url));

export default defineConfig({
  site: 'https://shawon-astro-site.vercel.app',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@portfolio': portfolioSrc,
      },
    },
    server: {
      // portfolioData.ts is the single source of truth and lives one level up in
      // the existing Vite app, so the dev server has to be allowed to read it.
      fs: {
        allow: [fileURLToPath(new URL('..', import.meta.url))],
      },
    },
  },
});