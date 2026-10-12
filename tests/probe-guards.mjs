import { chromium } from '@playwright/test';
const URL = process.env.AUDIT_URL ?? 'http://localhost:4183';
const browser = await chromium.launch();
const out = {};
for (const w of [320, 390, 768, 1440]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 800 }, hasTouch: w < 800, isMobile: w < 800 })).newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(()=>{});
  await page.waitForTimeout(2200);
  out[w] = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const sticky = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'sticky');
    const imgs = [...document.querySelectorAll('img')];
    return {
      overflowX: cs.overflowX,
      docScrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      scrollW_overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      stickyCount: sticky.length,
      stickyWorks: sticky.slice(0,3).map(e => getComputedStyle(e).position),
      bodyTouchAction: getComputedStyle(document.body).touchAction,
      oversizedImgs: imgs.filter(i => i.getBoundingClientRect().width > document.documentElement.clientWidth + 1).length,
      inputFontSizes: [...document.querySelectorAll('input,textarea,select')].slice(0,5).map(e => getComputedStyle(e).fontSize),
    };
  });
  await page.context().close();
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
