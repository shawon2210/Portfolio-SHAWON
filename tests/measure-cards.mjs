import { chromium } from '@playwright/test';
import fs from 'node:fs';

// Gate 2 evidence for the floating StageCards (v5 Phase 2).
// Checks: visible card count per breakpoint, that no card covers the face
// region, that the cards layer does not intercept pointer events, and captures
// the stage composition. Also prints the rendered card content for the mapping.

const VIEWPORTS = [
  ['320x568', 320, 568], ['390x844', 390, 844], ['430x932', 430, 932],
  ['768x1024', 768, 1024], ['1024x1366', 1024, 1366], ['1440x900', 1440, 900],
];

const browser = await chromium.launch();
const rows = [];
let contentDump = '';

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
    const portrait = document.querySelector('[data-testid="portrait-image"]');
    const layer = document.querySelector('[data-testid="stage-cards"]');
    const cards = [...document.querySelectorAll('[data-testid^="stage-card-"]')].filter(
      (c) => c.getAttribute('data-testid') !== 'stage-cards',
    );
    // Face region heuristic: central 40% width, top 55% height of the portrait.
    let faceRect = null;
    if (portrait) {
      const b = portrait.getBoundingClientRect();
      faceRect = {
        left: b.left + b.width * 0.30, right: b.left + b.width * 0.70,
        top: b.top + b.height * 0.12, bottom: b.top + b.height * 0.55,
      };
    }
    const overlap = (a, c) => !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
    const visible = cards.filter((c) => c.offsetParent !== null);
    let anyFaceOverlap = false;
    const contents = [];
    for (const c of cards) {
      const b = c.getBoundingClientRect();
      if (faceRect && c.offsetParent !== null && overlap(b, faceRect)) anyFaceOverlap = true;
      contents.push(`${c.getAttribute('data-testid')}: ${c.innerText.replace(/\s+/g, ' ').trim()}`);
    }
    return {
      totalCards: cards.length,
      visibleCards: visible.length,
      anyFaceOverlap,
      layerPointerEvents: layer ? getComputedStyle(layer).pointerEvents : 'n/a',
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      contents,
    };
  });
  rows.push({ name, ...r });
  contentDump += `\n[${name}] visible ${r.visibleCards}/${r.totalCards} | faceOverlap=${r.anyFaceOverlap} | pe=${r.layerPointerEvents}\n` +
    r.contents.map((c) => '   ' + c).join('\n');

  fs.mkdirSync('shots/stage-cards', { recursive: true });
  await page.evaluate(() => document.querySelector('[data-testid="portrait-stage"]')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  const stage = await page.$('[data-testid="portrait-stage"]');
  if (stage) await stage.screenshot({ path: `shots/stage-cards/${name}.png` });
  await page.context().close();
}

console.log(pad('viewport', 11) + pad('visible', 9) + pad('faceOverlap', 12) + pad('pointerEvents', 14) + pad('ovf', 5));
console.log('-'.repeat(52));
for (const r of rows) {
  console.log(pad(r.name, 11) + pad(`${r.visibleCards}/${r.totalCards}`, 9) +
    pad(r.anyFaceOverlap ? 'YES (BAD)' : 'no', 12) + pad(r.layerPointerEvents, 14) + pad(r.overflow, 5));
}
console.log('\nRENDERED CARD CONTENT (390px):' + contentDump.split('[390x844]')[1]?.split('[')[0] ?? '');
await browser.close();

function pad(s, n) { return String(s).padEnd(n); }