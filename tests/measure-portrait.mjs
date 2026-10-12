import { chromium } from '@playwright/test';
import fs from 'node:fs';

const VIEWPORTS = [
  ['320x568', 320, 568], ['360x640', 360, 640], ['375x667', 375, 667],
  ['390x844', 390, 844], ['412x915', 412, 915], ['430x932', 430, 932],
  ['600x960', 600, 960], ['768x1024', 768, 1024], ['820x1180', 820, 1180],
  ['1024x1366', 1024, 1366], ['1280x720', 1280, 720], ['1440x900', 1440, 900],
  ['1920x1080', 1920, 1080], ['2560x1440', 2560, 1440],
];

const browser = await chromium.launch();
const rows = [];

for (const [name, w, h] of VIEWPORTS) {
  const mobile = w < 640;
  const page = await (await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: mobile, isMobile: mobile,
  })).newPage();
  await page.goto(process.env.AUDIT_URL ?? 'http://localhost:4183', { waitUntil: 'load' });
  await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0);
  await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2600);

  const r = await page.evaluate(() => {
    const host = document.querySelector('[data-testid="hero-portrait"]');
    const img = host?.querySelector('img');
    if (!host || !img) return null;
    const b = host.getBoundingClientRect();
    const ib = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      dispW: Math.round(ib.width), dispH: Math.round(ib.height),
      pct: +((ib.width / document.documentElement.clientWidth) * 100).toFixed(1),
      ratio: +(ib.width / ib.height).toFixed(3),
      natural: `${img.naturalWidth}x${img.naturalHeight}`,
      currentSrc: (img.currentSrc || '').split('/').pop(),
      fmt: img.currentSrc.endsWith('.avif') ? 'avif' : img.currentSrc.endsWith('.webp') ? 'webp' : 'jpg',
      effDpr: img.naturalWidth ? +(img.naturalWidth / ib.width).toFixed(2) : null,
      hasSrcset: !!img.getAttribute('srcset') || !!host.querySelector('source'),
      sizes: img.getAttribute('sizes') || host.querySelector('source')?.getAttribute('sizes'),
      fetchprio: img.getAttribute('fetchpriority'),
      hasWH: !!(img.getAttribute('width') && img.getAttribute('height')),
      objectFit: cs.objectFit, objectPosition: cs.objectPosition,
      altLen: (img.getAttribute('alt') || '').length,
      frameRadius: getComputedStyle(host.querySelector('.profile-portrait__frame')).borderRadius,
      glowPresent: !!host.querySelector('.profile-portrait__glow'),
    };
  });
  if (r) rows.push({ name, ...r });

  fs.mkdirSync('shots/portrait', { recursive: true });
  await page.evaluate(() => document.querySelector('[data-testid="hero-portrait"]')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots/portrait/${name}.png` });
  await page.context().close();
}

console.log(pad('viewport', 11) + pad('W x H', 11) + pad('%VW', 7) + pad('ratio', 8) + pad('fmt', 6) + pad('natural', 10) + pad('effDPR', 8) + pad('srcset', 7) + pad('w/h', 5));
console.log('-'.repeat(84));
for (const r of rows) {
  console.log(pad(r.name, 11) + pad(`${r.dispW} x ${r.dispH}`, 11) + pad(r.pct + '%', 7) +
    pad(r.ratio, 8) + pad(r.fmt, 6) + pad(r.natural, 10) + pad(r.effDpr, 8) +
    pad(r.hasSrcset ? 'yes' : 'NO', 7) + pad(r.hasWH ? 'y' : 'n', 5));
}
const first = rows[0];
console.log(`\nsizes attr : ${first.sizes}`);
console.log(`fetchprio  : ${first.fetchprio}`);
console.log(`object     : ${first.objectFit} / ${first.objectPosition}`);
console.log(`radius     : ${first.frameRadius}   glow: ${first.glowPresent ? 'yes' : 'no'}   alt length: ${first.altLen}`);

function pad(s, n) { return String(s).padEnd(n); }

await browser.close();