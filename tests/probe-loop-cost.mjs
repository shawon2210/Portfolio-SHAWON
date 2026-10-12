import { chromium } from '@playwright/test';

// Which loop costs what on the MOBILE profile specifically?
// The desktop bisect showed ~1.5 FPS each; mobile DSF2 aggregates to 12.6 FPS.
// Suspects: the paint-only background-position loop (under a mix-blend-mode
// grain layer) and the three backdrop-filter cards translating over a
// live WebGL canvas (each move forces a full backdrop re-blur).

const URL = process.env.AUDIT_URL ?? 'http://localhost:4183';

async function run(label, css) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  if (css) {
    await page.addInitScript((c) => {
      document.addEventListener('DOMContentLoaded', () => {
        const s = document.createElement('style');
        s.textContent = c;
        document.head.appendChild(s);
      });
    }, css);
  }

  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);

  const r = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const frames = [];
        const t0 = performance.now();
        const tick = (t) => {
          frames.push(t);
          if (t - t0 < 4000) requestAnimationFrame(tick);
          else resolve(+(((frames.length - 1) / (frames[frames.length - 1] - frames[0])) * 1000).toFixed(1));
        };
        requestAnimationFrame(tick);
      }),
  );
  await browser.close();
  console.log(`${label.padEnd(40)} fps=${String(r).padStart(5)}`);
  return r;
}

const A = '.portrait-stage--anim ';
console.log('=== Mobile 390x844 DSF2 4x CPU — per-loop bisect ===\n');

const base = await run('all six ON', null);
const allOff = await run('all six OFF', `${A}.portrait-stage__slot-float,${A}.portrait-stage__cap,${A}.portrait-stage__shape{animation:none!important}`);

console.log('');
await run('OFF card-float only', `${A}.portrait-stage__slot-float{animation:none!important}`);
await run('OFF cap-drift only', `${A}.portrait-stage__cap{animation:none!important}`);
await run('OFF shape-grad only', `${A}.portrait-stage__shape{animation:none!important}`);

console.log('\n--- isolate the two mechanisms ---');
await run('cards: no backdrop-filter', `${A}.stage-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}`);
await run('cards: static bg, no glass', `${A}.stage-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:#111827}`);
await run('shape: no grain blend layer', `${A}.portrait-stage__shape::after{display:none!important}`);
await run('shape-grad replaced by transform', `${A}.portrait-stage__shape{animation:none!important}`);

console.log(`\nloops total cost: ${(allOff - base).toFixed(1)} FPS  (off=${allOff} on=${base})`);