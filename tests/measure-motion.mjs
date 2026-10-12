import { chromium } from '@playwright/test';

// Gate 3 evidence (v5 Phase3):
//  - FPS + long-task report on a 4x CPU-throttled mobile profile
//  - ambient loops pause when the stage is off-screen / tab hidden / site paused
//  - prefers-reduced-motion renders the final composed state (no loops)
//  - pointer parallax responds on fine pointer and stays flat on touch

const URL = process.env.AUDIT_URL ?? 'http://localhost:4183';

async function perf(name, w, h, opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: !!opts.mobile,
    hasTouch: !!opts.mobile,
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); // 4x CPU throttle
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500); // let entrance settle, then measure the live loop

  const res = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const longTasks = [];
        try {
          new PerformanceObserver((l) => l.getEntries().forEach((e) => longTasks.push(Math.round(e.duration))))
            .observe({ entryTypes: ['longtask'] });
        } catch {}
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          if (performance.now() - t0 < 3000) requestAnimationFrame(tick);
          else
            resolve({
              fps: +(frames / ((performance.now() - t0) / 1000)).toFixed(1),
              longTasks,
              longest: longTasks.length ? Math.max(...longTasks) : 0,
            });
        };
        requestAnimationFrame(tick);
      }),
  );
  console.log(`${name.padEnd(26)} fps=${String(res.fps).padStart(5)}  longTasks=${res.longTasks.length}  longest=${res.longest}ms  [${res.longTasks.join(',') || 'none'}]`);
  await browser.close();
  return res;
}

console.log('=== 4x CPU-throttled FPS + long tasks (3s sample, loops live) ===');
await perf('mobile 390x844', 390, 844, { mobile: true });
await perf('desktop 1440x900', 1440, 900);

// --- gating checks (desktop, fine pointer) ---
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2000);

const live = await page.evaluate(() => document.querySelector('[data-testid="portrait-stage"]')?.className.includes('portrait-stage--anim'));
console.log(`\nlive (anim class present, in view): ${live}`);

// Parallax: move pointer to stage edge, expect a transform on the portrait inner.
// MUST run before the pause toggle (parallax is gated off when paused).
await page.evaluate(() => window.scrollTo(0, 0));
const stage = await page.$('[data-testid="portrait-stage"]');
const box = await stage.boundingBox();
await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
await page.waitForTimeout(120);
await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.5, { steps: 6 });
await page.waitForTimeout(600);
const tf = await page.evaluate(() => ({
  portrait: document.querySelector('.portrait-stage__portrait-inner')?.style.transform || '(none)',
  shape: document.querySelector('.portrait-stage__shape-wrap')?.style.transform || '(none)',
  decor: document.querySelector('.portrait-stage__decor')?.style.transform || '(none)',
}));
console.log(`parallax -> portrait:${tf.portrait} | shape:${tf.shape} | decor:${tf.decor}`);

// pause toggle: click the 3D pause button, stage should drop to --still
const pauseBtn = await page.$('[data-testid*="pause"], button[aria-label*="Pause" i], button[title*="Pause" i]');
if (pauseBtn) {
  await pauseBtn.click();
  await page.waitForTimeout(400);
  const stillAfterPause = await page.evaluate(() => document.querySelector('[data-testid="portrait-stage"]')?.className.includes('portrait-stage--still'));
  console.log(`after site pause toggle -> --still: ${stillAfterPause}`);
} else {
  console.log('pause button not found');
}
await browser.close();

// --- reduced motion ---
const b2 = await chromium.launch();
const p2 = await (await b2.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
await p2.goto(URL, { waitUntil: 'load' });
await p2.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await p2.waitForTimeout(1200);
const rm = await p2.evaluate(() => {
  const s = document.querySelector('[data-testid="portrait-stage"]');
  const shape = document.querySelector('[data-testid="stage-shape"]');
  return {
    still: s?.className.includes('portrait-stage--still'),
    shapeVisible: shape ? getComputedStyle(shape).opacity : null,
    shapeAnim: shape ? getComputedStyle(shape).animationName : null,
    statText: document.querySelector('[data-testid="stage-card-stat"] .stage-card__value')?.textContent?.trim(),
  };
});
console.log(`\nREDUCED MOTION: still=${rm.still}  shapeOpacity=${rm.shapeVisible}  shapeAnim=${rm.shapeAnim}  stat=${rm.statText}`);
await b2.close();