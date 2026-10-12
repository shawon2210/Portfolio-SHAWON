import { chromium } from '@playwright/test';
const URL = process.env.AUDIT_URL ?? 'http://localhost:4173';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);

const r = await page.evaluate(() => {
  const header = document.querySelector('header.fixed');
  const cs = getComputedStyle(header);
  const inner = header.querySelector('div.max-w-7xl');
  const brand = header.querySelector('button');
  // what's forcing 509?
  const kids = [...header.querySelectorAll('*')].map((e) => {
    const b = e.getBoundingClientRect();
    return { cls: (e.className?.toString?.() ?? '').slice(0, 54), w: Math.round(b.width), left: Math.round(b.left), right: Math.round(b.right) };
  }).filter((k) => k.right > 320 || k.w > 320);
  return {
    headerRect: header.getBoundingClientRect().toJSON(),
    headerWidth: cs.width, headerLeft: cs.left, headerRight: cs.right,
    headerInset: cs.inset, headerPosition: cs.position,
    parentClass: header.parentElement?.className?.toString?.(),
    parentDisplay: getComputedStyle(header.parentElement).display,
    innerW: inner ? Math.round(inner.getBoundingClientRect().width) : null,
    innerClass: inner?.className?.toString?.(),
    wideKids: kids.slice(0, 10),
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();