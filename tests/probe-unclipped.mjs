import { chromium } from '@playwright/test';

const URL = process.env.AUDIT_URL ?? 'http://localhost:4173';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2500);

const probe = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const de = document.documentElement;
  const path = (el) => {
    const parts = [];
    let n = el;
    while (n && n !== de && parts.length < 6) {
      const tag = n.tagName?.toLowerCase() ?? '?';
      const td = n.getAttribute?.('data-testid') ? `[${n.getAttribute('data-testid')}]` : '';
      const cls = (n.className?.toString?.() ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      parts.unshift(tag + td + (cls ? '.' + cls : ''));
      n = n.parentElement;
    }
    return parts.join(' > ');
  };
  // Is any ancestor clipping on X? If yes, this element can't widen the document.
  const isClippedByAncestor = (el) => {
    let n = el.parentElement;
    while (n && n !== de) {
      const cs = getComputedStyle(n);
      if (cs.overflowX !== 'visible') return true;
      n = n.parentElement;
    }
    return false;
  };

  const unclipped = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    const rightOver = r.right - vw;
    const leftOver = -r.left;
    if (rightOver <= 0.5 && leftOver <= 0.5) continue;
    if (isClippedByAncestor(el)) continue;
    const cs = getComputedStyle(el);
    unclipped.push({
      path: path(el).slice(0, 170),
      rectW: Math.round(r.width), rectH: Math.round(r.height),
      left: Math.round(r.left),
      rightOver: Math.round(rightOver), leftOver: Math.round(leftOver),
      position: cs.position, overflowX: cs.overflowX,
      width: cs.width, minWidth: cs.minWidth,
      text: (el.textContent || '').trim().slice(0, 30),
    });
  }
  unclipped.sort((a, b) => Math.max(b.rightOver, b.leftOver) - Math.max(a.rightOver, a.leftOver));
  return { vw, docScrollW: de.scrollWidth, unclippedCount: unclipped.length, unclipped: unclipped.slice(0, 12) };
});

console.log(JSON.stringify(probe, null, 2));
await browser.close();