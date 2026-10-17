import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

// Post-deploy smoke check against PRODUCTION (not the local preview).
// Asserts the shipped build actually carries the v5/Phase3 perf fix and that
// the stage composes correctly in a real browser on the real domain.
//
// The default target is read from src/config/site.ts so this check can never
// drift onto a retired alias. Override with `node tests/smoke-production.mjs <url>`.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteConfig = fs.readFileSync(path.join(root, 'src/config/site.ts'), 'utf8');
const canonical = siteConfig.match(/SITE_ORIGIN\s*(?::\s*string\s*)?=\s*['"]([^'"]+)['"]/)?.[1];

if (!canonical) {
  throw new Error('Could not read SITE_ORIGIN from src/config/site.ts');
}

const URL = process.argv[2] ?? canonical;
console.log(`smoke target: ${URL}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => !document.querySelector('[class*="preloader"]'), { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500);

const r = await page.evaluate(() => {
  const stage = document.querySelector('[data-testid="portrait-stage"]');
  const card = document.querySelector('.stage-card');
  const shape = document.querySelector('.portrait-stage__shape');
  const cs = card ? getComputedStyle(card) : null;
  const ss = shape ? getComputedStyle(shape) : null;
  const portrait = document.querySelector('[data-testid="portrait-image"]');
  return {
    stagePresent: !!stage,
    stageClass: stage?.className ?? null,
    ambientLive: !!stage?.className.includes('portrait-stage--anim'),
    cards: document.querySelectorAll('.stage-card').length,
    // the fix: no backdrop-filter on the moving glass surface
    cardBackdropFilter: cs?.backdropFilter ?? null,
    shapeAnimation: ss?.animationName ?? null,
    shapeTransform: ss?.transform ?? null,
    portraitLoaded: portrait ? portrait.complete && portrait.naturalWidth > 0 : false,
    horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
  };
});

const checks = [
  ['stage renders', r.stagePresent],
  ['ambient loops live', r.ambientLive],
  ['stage cards render', r.cards >= 2],
  ['no backdrop-filter on moving card', r.cardBackdropFilter === 'none'],
  ['shape loop is ps-grad', r.shapeAnimation === 'ps-grad'],
  ['ps-grad is transform (not background-position)', r.shapeTransform !== 'none'],
  ['portrait image loaded', r.portraitLoaded],
  ['no horizontal overflow', r.horizontalOverflow === 0],
];

console.log(`production smoke: ${URL}\n`);
for (const [name, ok] of checks) console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}`);
console.log(`\ncards=${r.cards} stageClass="${r.stageClass}"`);
if (errors.length) console.log(`\npage errors (${errors.length}): ${errors.slice(0, 3).join(' | ')}`);

const failed = checks.filter(([, ok]) => !ok);
await browser.close();
console.log(`\n${failed.length ? `FAILED: ${failed.map(([n]) => n).join(', ')}` : 'ALL CHECKS PASSED'}`);
process.exit(failed.length ? 1 : 0);