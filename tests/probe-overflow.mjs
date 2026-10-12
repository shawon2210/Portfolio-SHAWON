import { chromium, devices } from '@playwright/test';

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
    while (n && n !== de && parts.length < 5) {
      const tag = n.tagName?.toLowerCase() ?? '?';
      const id = n.id ? '#' + n.id : '';
      const td = n.getAttribute?.('data-testid') ? `[${n.getAttribute('data-testid')}]` : '';
      const cls = (n.className?.toString?.() ?? '').split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      parts.unshift(tag + id + td + (cls ? '.' + cls : ''));
      n = n.parentElement;
    }
    return parts.join(' > ');
  };

  // Every element whose own scrollWidth/offsetWidth forces the document wide,
  // plus every element that literally overflows the viewport without being clipped.
  const wide = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width < 200) continue;
    const cs = getComputedStyle(el);
    const rectRight = r.right - vw;
    const selfWide = el.scrollWidth > el.clientWidth + 1;
    const notClipped = cs.overflowX === 'visible' && cs.position !== 'fixed';
    if (rectRight > 0.5 || (selfWide && notClipped)) {
      wide.push({
        path: path(el).slice(0, 150),
        rectW: Math.round(r.width),
        rectLeft: Math.round(r.left),
        rectRightOver: Math.round(rectRight),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        overflowX: cs.overflowX,
        position: cs.position,
        minWidth: cs.minWidth,
        width: cs.width,
        maxWidth: cs.maxWidth,
      });
    }
  }

  return {
    vw, docScrollW: de.scrollWidth, bodyScrollW: document.body.scrollWidth,
    bodyRect: Math.round(document.body.getBoundingClientRect().width),
    wideCount: wide.length,
    widest: wide.sort((a, b) => Math.max(b.rectW, b.scrollW) - Math.max(a.rectW, a.scrollW)).slice(0, 14),
  };
});

console.log(JSON.stringify(probe, null, 2));
await browser.close();