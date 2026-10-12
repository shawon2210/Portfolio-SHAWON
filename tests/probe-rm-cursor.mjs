import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce', ...devices['Pixel 5'] });
const page = await ctx.newPage();
await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4173', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const r = await page.evaluate(() => {
  const matches = [...document.querySelectorAll('[class*="cursor"]')].map(e => ({
    tag: e.tagName.toLowerCase(),
    cls: e.className.toString().slice(0, 90),
  }));
  // the real CursorFollower mounts a fixed pointer-events-none ring; look for its shape
  const follower = [...document.querySelectorAll('div')].find(e => {
    const c = e.className?.toString?.() ?? '';
    return /cursor-follower|cursor-ring|cursor__/i.test(c);
  });
  return {
    matches,
    realFollower: follower ? follower.className.toString().slice(0,90) : null,
    bodyCursorStyle: getComputedStyle(document.body).cursor,
    hasCustomCursorClass: document.documentElement.className + '|' + document.body.className,
    mixBlendCount: [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).mixBlendMode !== 'normal').length,
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
