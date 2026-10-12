import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183', { waitUntil: 'load' });
await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);

// Bring each [data-tap] into view individually, then probe the hit area.
const results = [];
const count = await page.evaluate(() => document.querySelectorAll('[data-tap]').length);

for (let i = 0; i < count; i++) {
  await page.evaluate((idx) => {
    document.querySelectorAll('[data-tap]')[idx]?.scrollIntoView({ block: 'center' });
  }, i);
  await page.waitForTimeout(900);

  const r = await page.evaluate((idx) => {
    const el = document.querySelectorAll('[data-tap]')[idx];
    if (!el) return null;
    const bb = el.getBoundingClientRect();
    const cx = bb.left + bb.width / 2;
    const cy = bb.top + bb.height / 2;
    // probe 18px outside the visual box — inside the intended 44x44 region
    const probes = [[cx - 18, cy], [cx + 18, cy], [cx, cy - 18], [cx, cy + 18]];
    let ok = 0, tested = 0;
    for (const [x, y] of probes) {
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      tested++;
      const t = document.elementFromPoint(x, y);
      if (t && (t === el || el.contains(t))) ok++;
    }
    return {
      txt: (el.textContent || '').trim().slice(0, 16) || el.getAttribute('title'),
      visual: `${Math.round(bb.width)}x${Math.round(bb.height)}`,
      hitProbe: `${ok}/${tested}`,
    };
  }, i);

  if (r) results.push(r);
}

console.log(JSON.stringify(results, null, 2));
await browser.close();