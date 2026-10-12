import { chromium } from '@playwright/test';
const URL = process.env.AUDIT_URL ?? 'http://localhost:4173';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);

const res = await page.evaluate(() => {
  const de = document.documentElement;
  const base = de.scrollWidth;
  const log = [];

  // 1. hide the fixed header
  const header = document.querySelector('header.fixed');
  header.style.display = 'none';
  log.push({ step: 'hide <header.fixed>', docScrollW: de.scrollWidth, headerWas: Math.round(header.getBoundingClientRect().width) });
  header.style.display = '';

  // 2. hide the fixed background scene wrapper
  const bg = document.querySelector('div.fixed.inset-0.z-0');
  if (bg) {
    bg.style.display = 'none';
    log.push({ step: 'hide div.fixed.inset-0.z-0', docScrollW: de.scrollWidth });
    bg.style.display = '';
  }

  // 3. hide the whole marquee section (both marquees)
  const marqueeWrap = document.querySelector('.overflow-hidden.whitespace-nowrap.select-none');
  const section = marqueeWrap?.closest('section');
  if (section) {
    section.style.display = 'none';
    log.push({ step: 'hide marquee <section>', docScrollW: de.scrollWidth });
    section.style.display = '';
  }

  // 4. hide main entirely
  const main = document.querySelector('main');
  main.style.display = 'none';
  log.push({ step: 'hide <main>', docScrollW: de.scrollWidth });
  main.style.display = '';

  // 5. what is the widest DIRECT child of body/root chain, and does header width track viewport?
  const measure = [];
  for (const w of [320, 360, 412, 500, 600, 768]) {
    // can't resize from inside; instead report computed relationships
  }
  const headerCS = getComputedStyle(header);
  return {
    base,
    log,
    header: { width: headerCS.width, left: headerCS.left, right: headerCS.right, boxSizing: headerCS.boxSizing, display: headerCS.display, maxWidth: headerCS.maxWidth, transform: headerCS.transform, classes: header.className.toString() },
    rootClasses: document.querySelector('#root > div')?.className?.toString?.(),
  };
});

console.log(JSON.stringify(res, null, 2));
await browser.close();