import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 320, height: 800 }, hasTouch: true, isMobile: true })).newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183', { waitUntil: 'load' });
await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(()=>{});
await page.waitForTimeout(2000);
const r = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const clipped = (el) => { let n = el.parentElement; while (n && n !== document.documentElement) { if (getComputedStyle(n).overflowX !== 'visible') return true; n = n.parentElement; } return false; };
  return {
    vw,
    oversized: [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().width > vw + 1).map(i => ({
      w: Math.round(i.getBoundingClientRect().width),
      src: (i.currentSrc||i.src).split('/').pop().slice(0,34),
      clippedByAncestor: clipped(i),
    })).slice(0,6),
    unclippedOversized: [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().width > vw + 1 && !clipped(i)).length,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
