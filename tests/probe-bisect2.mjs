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
  const desc = (el) => {
    const p = [];
    let n = el;
    while (n && n !== de && p.length < 7) {
      const td = n.getAttribute?.('data-testid') ? `[${n.getAttribute('data-testid')}]` : '';
      const c = (n.className?.toString?.() ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      p.unshift(n.tagName?.toLowerCase() + td + (c ? '.' + c : ''));
      n = n.parentElement;
    }
    return p.join('>');
  };

  // Only consider elements inside <main> that are NOT clipped by an ancestor.
  const clipped = (el) => {
    let n = el.parentElement;
    while (n && n !== de) {
      if (getComputedStyle(n).overflowX !== 'visible') return true;
      n = n.parentElement;
    }
    return false;
  };

  const cands = [...document.querySelectorAll('main *')].filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.right - document.documentElement.clientWidth <= 0.5) return false;
    return !clipped(el);
  });

  const results = [];
  for (const el of cands) {
    const prev = el.style.display;
    el.style.display = 'none';
    const after = de.scrollWidth;
    el.style.display = prev;
    if (after < base) {
      const r0 = el.getBoundingClientRect();
      results.push({
        path: desc(el).slice(0, 160),
        dropsScrollWidthTo: after,
        rectW: Math.round(r0.width), rectH: Math.round(r0.height),
        left: Math.round(r0.left), right: Math.round(r0.right),
        tag: el.tagName.toLowerCase(),
        scrollW: el.scrollWidth, clientW: el.clientWidth,
      });
    }
  }
  // smallest = deepest/most specific culprit
  results.sort((a, b) => a.rectW * a.rectH - b.rectW * b.rectH);
  return { base, viewport: document.documentElement.clientWidth, candidates: cands.length, culprits: results.slice(0, 10) };
});

console.log(JSON.stringify(res, null, 2));
await browser.close();