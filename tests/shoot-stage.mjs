import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// Visual regression shots for the stage after the v5/Phase3 perf fixes
// (gradient loop -> transform, card backdrop-filter -> opaque glass).

const URL = process.env.AUDIT_URL ?? 'http://localhost:4183';
const OUT = 'shots';
mkdirSync(OUT, { recursive: true });

const profiles = [
  { name: 'stage-desktop', w: 1440, h: 900, dsf: 1 },
  { name: 'stage-mobile', w: 390, h: 844, dsf: 2, mobile: true },
];

for (const p of profiles) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: p.w, height: p.h },
    deviceScaleFactor: p.dsf,
    isMobile: !!p.mobile,
    hasTouch: !!p.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2600); // let the entrance + count-up settle

  const stage = await page.$('[data-testid="portrait-stage"]');
  if (stage) await stage.screenshot({ path: `${OUT}/${p.name}.png` });

  // Report the resolved surfaces so the glass change is measurable, not just visible.
  const info = await page.evaluate(() => {
    const card = document.querySelector('.stage-card');
    const shape = document.querySelector('.portrait-stage__shape');
    const cs = card ? getComputedStyle(card) : null;
    const ss = shape ? getComputedStyle(shape) : null;
    return {
      cardBackdrop: cs?.backdropFilter,
      cardBg: cs?.backgroundImage?.slice(0, 60),
      shapeAnim: ss?.animationName,
      stageClass: document.querySelector('[data-testid="portrait-stage"]')?.className,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(`${p.name}: ${JSON.stringify(info)}`);
  await browser.close();
}