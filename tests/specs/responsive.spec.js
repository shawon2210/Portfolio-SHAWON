/**
 * Phase 0 — responsive audit.
 *
 * Collects machine-measured evidence per viewport / per section. Every check
 * runs inside the page and returns structured data; assertions are intentionally
 * LOOSE in this phase so a failing run still produces a full report instead of
 * aborting on the first bug. The findings, not the pass/fail, are the Phase 0
 * deliverable.
 */

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('tests/.artifacts');
fs.mkdirSync(OUT, { recursive: true });

export const VIEWPORTS = [
  // --- portrait phones ---
  { name: '320x568',   width: 320,  height: 568,  kind: 'phone'    },
  { name: '360x640',   width: 360,  height: 640,  kind: 'phone'    },
  { name: '375x667',   width: 375,  height: 667,  kind: 'phone'    },
  { name: '390x844',   width: 390,  height: 844,  kind: 'phone'    },
  { name: '412x915',   width: 412,  height: 915,  kind: 'phone'    },
  { name: '430x932',   width: 430,  height: 932,  kind: 'phone'    },
  // --- portrait tablets / small laptops ---
  { name: '600x960',   width: 600,  height: 960,  kind: 'tablet'   },
  { name: '768x1024',  width: 768,  height: 1024, kind: 'tablet'   },
  { name: '820x1180',  width: 820,  height: 1180, kind: 'tablet'   },
  { name: '1024x1366', width: 1024, height: 1366, kind: 'tablet'   },
  // --- desktop ---
  { name: '1280x720',  width: 1280, height: 720,  kind: 'desktop'  },
  { name: '1440x900',  width: 1440, height: 900,  kind: 'desktop'  },
  { name: '1920x1080', width: 1920, height: 1080, kind: 'desktop'  },
  { name: '2560x1440', width: 2560, height: 1440, kind: 'desktop'  },
  // --- landscape ---
  { name: '667x375',   width: 667,  height: 375,  kind: 'landscape' },
  { name: '844x390',   width: 844,  height: 390,  kind: 'landscape' },
  { name: '915x412',   width: 915,  height: 412,  kind: 'landscape' },
  { name: '1024x768',  width: 1024, height: 768,  kind: 'landscape' },
];

const SECTIONS = ['home', 'projects', 'experience', 'contact'];

const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

test.describe.configure({ mode: 'parallel' });

async function settle(page) {
  await page.waitForFunction(() => {
    const r = document.getElementById('root');
    return r && r.childElementCount > 0;
  }, { timeout: 30_000 });
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(2600);
}

async function attachCollectors(page) {
  await page.addInitScript(() => {
    window.__auditCLS = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) window.__auditCLS = (window.__auditCLS || 0) + e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch { /* layout-shift unsupported — skip CLS */ }
  });
}

const collectorSrc = fs.readFileSync(path.resolve('tests/specs/_collect.js'), 'utf8');

// Each worker is a separate Node process with its own module registry, so a
// shared in-memory `results` object would lose every worker but the last one.
// Write one file per run and merge in a global teardown instead.
const RUNS_DIR = path.join(OUT, 'runs');
fs.mkdirSync(RUNS_DIR, { recursive: true });

for (const vp of VIEWPORTS) {
  for (const project of ['chromium', 'webkit']) {
    test(`${vp.name} @ ${project}`, async ({ browserName, browser }) => {
      test.skip(browserName !== project, 'matrix pinning engine');

      // UA + touch emulation are CONTEXT-level in Playwright, not page-level,
      // so each viewport gets its own context rather than reusing the fixture.
      const mobile = vp.kind === 'phone' || vp.kind === 'landscape';
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        userAgent: mobile ? MOBILE_UA : undefined,
        hasTouch: mobile,
        isMobile: mobile,
        locale: 'en-US',
        reducedMotion: 'no-preference',
      });
      const page = await context.newPage();

      if (mobile) {
        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });
        });
      }

      const consoleMsgs = [];
      const pageErrors = [];
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') {
          consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 200) });
        }
      });
      page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));

      await attachCollectors(page);
      await page.goto('/', { waitUntil: 'load' });
      await settle(page);

      const data = await page.evaluate(collectorSrc);

      const perSection = {};
      for (const s of SECTIONS) {
        await page.evaluate((id) => { location.hash = '#' + id; }, s);
        await page.waitForTimeout(1500);
        const sec = await page.evaluate((src) => eval(src), collectorSrc);
        perSection[s] = {
          horizontalOverflow: sec.horizontalOverflow,
          offenders: sec.offenders.slice(0, 6),
          smallTargets: sec.smallTargets.slice(0, 6),
          collisions: sec.collisions.slice(0, 4),
        };
      }

      const dir = path.join(OUT, 'screens', vp.name);
      fs.mkdirSync(dir, { recursive: true });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);

      // WebKit's fullPage capture on a ~13k px document with a live WebGL
      // canvas can exceed the test timeout. Freeze animation + never let a
      // screenshot failure abort the measurement run.
      const shot = async (file, full) => {
        try {
          await page.screenshot({
            path: path.join(dir, file),
            fullPage: full,
            animations: 'disabled',
            caret: 'hide',
            timeout: 25_000,
          });
          return true;
        } catch {
          // fall back to a viewport-sized capture of the current scroll pos
          try {
            await page.screenshot({ path: path.join(dir, file), animations: 'disabled', timeout: 15_000 });
          } catch { /* give up on this capture, data is still collected */ }
          return false;
        }
      };
      const shotFold = await shot(`${project}-fold.png`, false);
      const shotFull = await shot(`${project}-full.png`, true);

      let fps = null;
      if (browserName === 'chromium') {
        try {
          const cdp = await context.newCDPSession(page);
          if (mobile) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
          fps = await page.evaluate(async () => {
            const t0 = performance.now();
            let frames = 0;
            await new Promise((res) => {
              const tick = () => { frames++; (performance.now() - t0 < 3000) ? requestAnimationFrame(tick) : res(); };
              requestAnimationFrame(tick);
            });
            return +(frames / ((performance.now() - t0) / 1000)).toFixed(1);
          });
          if (mobile) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
        } catch { /* CDP unavailable on this engine */ }
      }

      await fs.promises.writeFile(
        path.join(RUNS_DIR, `${vp.name}__${project}.json`),
        JSON.stringify({
          viewport: vp, engine: project,
          ...data, perSection, fps,
          shots: { fold: shotFold, full: shotFull },
          consoleMsgs, pageErrors,
        }, null, 2),
      );

      expect(data.vw).toBeTruthy();
      await context.close();
    });
  }
}

// Runs after all workers exit — the only place a single process sees every file.
test.afterAll(async () => {
  // give sibling workers a moment to flush their last write
  await new Promise((r) => setTimeout(r, 1500));
  const files = fs.existsSync(RUNS_DIR) ? fs.readdirSync(RUNS_DIR).filter((f) => f.endsWith('.json')) : [];
  const results = {};
  for (const f of files) {
    try { results[f.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(RUNS_DIR, f), 'utf8')); } catch {}
  }
  fs.writeFileSync(path.join(OUT, 'matrix.json'), JSON.stringify(results, null, 2));

  const entries = Object.values(results);
  const overflow = entries.filter((r) => r.horizontalOverflow > 0);
  const errs = entries.filter((r) => r.pageErrors.length > 0);
  console.log(`\n=== RESPONSIVE MATRIX: ${entries.length} runs collected ===`);
  console.log(`horizontal overflow >0 : ${overflow.length} -> ${overflow.map((r) => `${r.viewport.name}/${r.engine}(+${r.horizontalOverflow}px)`).join(', ') || 'none'}`);
  console.log(`page errors            : ${errs.length} -> ${errs.map((r) => `${r.viewport.name}/${r.engine}`).join(', ') || 'none'}`);
  console.log(`runs w/ tiny text      : ${entries.filter((r) => r.tinyText.length > 0).length}`);
  console.log(`runs w/ small targets  : ${entries.filter((r) => r.smallTargets.length > 0).length}`);
  console.log(`runs w/ collisions     : ${entries.filter((r) => r.collisions.length > 0).length}`);
});