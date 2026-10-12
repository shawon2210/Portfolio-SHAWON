import { chromium, devices } from '@playwright/test';

const URL = process.env.AUDIT_URL ?? 'http://localhost:4173';
const out = {};

/* ---------- FPS: 3D scene, 4x CPU throttle, mobile profile ---------- */
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const cdp = await ctx.newCDPSession(page);
  const measure = async (label, rate) => {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    // scroll sweep so 3D objects enter/leave the viewport, then sample
    const r = await page.evaluate(async () => {
      const t0 = performance.now(); let frames = 0; const dts = [];
      let last = performance.now();
      const done = performance.now() + 4000;
      const tick = () => {
        const n = performance.now(); dts.push(n - last); last = n; frames++;
        if (n < done) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const scroll = async () => {
        for (let i = 0; i < 10; i++) { window.scrollBy(0, innerHeight * 0.7); await new Promise(r => setTimeout(r, 200)); }
      };
      scroll();
      await new Promise(r => setTimeout(r, 4000));
      const secs = (performance.now() - t0) / 1000;
      dts.sort((a, b) => a - b);
      return {
        fps: +(frames / secs).toFixed(1),
        p50: +dts[Math.floor(dts.length * 0.5)].toFixed(1),
        p95: +dts[Math.floor(dts.length * 0.95)].toFixed(1),
        worst: +dts[dts.length - 1].toFixed(1),
        over50ms: dts.filter((d) => d > 50).length,
        total: dts.length,
      };
    });
    out[`fps_${label}`] = r;
  };

  await measure('pixel5_1x', 1);
  await measure('pixel5_4x', 4);

  // WebGL / tier diagnostics
  out.webgl = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return { canvas: false };
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return {
      canvas: true,
      w: c.width, h: c.height,
      cssW: Math.round(c.getBoundingClientRect().width),
      cssH: Math.round(c.getBoundingClientRect().height),
      dpr: window.devicePixelRatio,
      renderer: gl ? gl.getParameter(gl.RENDERER) : null,
      contexts: document.querySelectorAll('canvas').length,
    };
  });
  await browser.close();
}

/* ---------- reduced-motion + INP proxy ---------- */
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ reducedMotion: 'reduce', ...devices['Pixel 5'] });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  out.reducedMotion = await page.evaluate(() => ({
    preloaderPresent: !!document.querySelector('[class*="preloader"]'),
    cursorMounted: !!document.querySelector('[class*="cursor"]'),
    sessionFlags: Object.keys(sessionStorage),
    htmlScrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    canvases: document.querySelectorAll('canvas').length,
  }));

  // INP-ish: longest interaction latency across 12 taps
  await page.evaluate(() => {
    window.__lat = [];
    ['pointerdown', 'keydown'].forEach((t) =>
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lat.push(+e.duration.toFixed(1)); })
        .observe({ type: 'event', buffered: true, durationThreshold: 16 }));
  });
  const tapTargets = await page.$$('button, a[href]');
  for (let i = 0; i < Math.min(12, tapTargets.length); i++) {
    await tapTargets[i].click({ timeout: 3000, force: true }).catch(() => {});
    await page.waitForTimeout(220);
  }
  const lat = await page.evaluate(() => window.__lat || []);
  lat.sort((a, b) => b - a);
  out.interaction = { samples: lat.length, worst: lat[0] ?? null, p95: lat[Math.floor(lat.length * 0.05)] ?? null, median: lat[Math.floor(lat.length / 2)] ?? null };
  await browser.close();
}

console.log(JSON.stringify(out, null, 2));