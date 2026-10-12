import { defineConfig, devices } from '@playwright/test';

/**
 * Responsive audit harness.
 *
 * Targets the PRODUCTION build (`vite preview`) rather than the dev server,
 * because dev serves unbundled modules, adds HMR clients and disables
 * minification — all of which change layout timing and can mask real
 * overflow/jank. Audit results must reflect what users actually receive.
 *
 *   npm run build && npm run preview   (serves :4173)
 *   npm run test:responsive
 */

// Port 4173 was previously used by leftover `vite preview` servers from
// benchmarking; `reuseExistingServer` silently bound to those stale builds and
// audited the wrong code. Use a dedicated port and never reuse.
const AUDIT_PORT = Number(process.env.AUDIT_PORT ?? 4183);
const PREVIEW_URL = process.env.AUDIT_URL ?? `http://localhost:${AUDIT_PORT}`;

export default defineConfig({
  // NB: paths resolve relative to THIS file (tests/), not the repo root.
  testDir: './specs',
  // NB: outputDir is repo-rooted so artifacts never nest under tests/tests/
  outputDir: '../tests/.artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 90_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list', { printSteps: false }],
    ['json', { outputFile: './.artifacts/results.json' }],
  ],

  use: {
    baseURL: PREVIEW_URL,
    // Deterministic captures: the cinematic intro is time-based.
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Safari engine — the important engine here: iOS Safari is where
      // sticky-stack, dvh, and safe-area problems actually surface.
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    // Rebuild first: the audit must always reflect the current source.
    command: `npm run build && npm run preview -- --port ${AUDIT_PORT} --strictPort`,
    url: PREVIEW_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});