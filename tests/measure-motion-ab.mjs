import { chromium } from '@playwright/test';

// Gate 3 — clean isolation of the stage's own motion cost.
//
// CORRECTION to the first A/B attempt: toggling localStorage
// 'shawon_portfolio_bg_paused' ALSO stops the WebGL rAF loop
// (BackgroundScene.tsx:463), so it measured "WebGL on vs off", not
// "stage loops on vs off". That produced a bogus -36 FPS delta.
//
// This harness toggles the stage's CSS animations ONLY, leaving the shared 3D
// scene running identically in every row. Two CPU profiles, because paint-bound
// costs are amplified by throttling and may not reflect the real desktop case.

const URL = process.env.AUDIT_URL ?? 'http://localhost:4183';

const OFF_ANIM = '.portrait-stage--anim .portrait-stage__slot-float,.portrait-stage--anim .portrait-stage__cap,.portrait-stage--anim .portrait-stage__shape{animation:none!important}';

async function run(label, { w = 1440, h = 900, dsf = 1, throttle = 1, css = null, hideStage = false }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });

  if (css || hideStage) {
    await page.addInitScript(
      ([c, hide]) => {
        document.addEventListener('DOMContentLoaded', () => {
          if (c) {
            const s = document.createElement('style');
            s.textContent = c;
            document.head.appendChild(s);
          }
          if (hide) document.querySelector('[data-testid="portrait-stage"]')?.remove();
        });
      },
      [css, hideStage],
    );
  }

  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);

  const r = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const longTasks = [];
        try {
          new PerformanceObserver((l) => l.getEntries().forEach((e) => longTasks.push(Math.round(e.duration))))
            .observe({ entryTypes: ['longtask'] });
        } catch {}
        const frames = [];
        const t0 = performance.now();
        const tick = (t) => {
          frames.push(t);
          if (t - t0 < 4000) requestAnimationFrame(tick);
          else {
            const d = [];
            for (let i = 1; i < frames.length; i++) d.push(frames[i] - frames[i - 1]);
            d.sort((a, b) => a - b);
            resolve({
              fps: +(((frames.length - 1) / (frames[frames.length - 1] - frames[0])) * 1000).toFixed(1),
              p95: +(d[Math.floor(d.length * 0.95)] ?? 0).toFixed(1),
              over50: d.filter((x) => x > 50).length,
              longTasks: longTasks.length,
            });
          }
        };
        requestAnimationFrame(tick);
      }),
  );
  await browser.close();
  console.log(`${label.padEnd(38)} fps=${String(r.fps).padStart(5)}  p95=${String(r.p95).padStart(5)}ms  >50ms=${String(r.over50).padStart(2)}  longTasks=${r.longTasks}`);
  return r;
}

console.log('=== Stage motion cost — CSS-only toggle, WebGL scene running in EVERY row ===\n');

for (const [prof, opts] of [
  ['desktop 1440x900 DSF1 1x CPU (real desktop)', { throttle: 1 }],
  ['desktop 1440x900 DSF1 4x CPU (throttled)', { throttle: 4 }],
  ['mobile 390x844  DSF2 4x CPU (Gate 3 profile)', { w: 390, h: 844, dsf: 2, throttle: 4 }],
]) {
  console.log(`--- ${prof} ---`);
  const live = await run('  stage loops ON', opts);
  const off = await run('  stage loops OFF (CSS only)', { ...opts, css: OFF_ANIM });
  const gone = await run('  stage element REMOVED', { ...opts, hideStage: true });
  const d = (a, b) => `${a - b >= 0 ? '+' : ''}${(a - b).toFixed(1)}`;
  console.log(`  -> loops cost ${d(off.fps, live.fps)} FPS | whole stage costs ${d(gone.fps, live.fps)} FPS\n`);
}