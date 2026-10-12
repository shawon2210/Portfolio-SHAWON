import { chromium } from '@playwright/test';
import fs from 'node:fs';

// Gate 1 evidence for <PortraitStage /> (v5 Phase 1).
// Measures the stage box, the framed portrait image, the shape, and horizontal
// overflow, and captures a stage screenshot at each breakpoint.

const VIEWPORTS = [
  ['320x568', 320, 568], ['360x640', 360, 640], ['390x844', 390, 844],
  ['430x932', 430, 932], ['768x1024', 768, 1024], ['1024x1366', 1024, 1366],
  ['1440x900', 1440, 900], ['1920x1080', 1920, 1080],
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
  await page.waitForTimeout(2800); // let the portrait entrance settle

  const r = await page.evaluate(() => {
    const stage = document.querySelector('[data-testid="portrait-stage"]');
    const img = document.querySelector('[data-testid="portrait-image"]');
    const shape = document.querySelector('[data-testid="stage-shape"]');
    if (!stage || !img) return null;
    const sb = stage.getBoundingClientRect();
    const ib = img.getBoundingClientRect();
    const shb = shape ? shape.getBoundingClientRect() : null;
    // Horizontal overflow of the whole document.
    const docOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    // Chromium reports a density-adjusted naturalWidth for srcset-selected images,
    // so derive the true effective DPR from the loaded variant's real width.
    const loaded = (img.currentSrc || '').split('/').pop();
    const variantW = parseInt(loaded, 10) || null;
    return {
      stageW: Math.round(sb.width), stageH: Math.round(sb.height),
      stageRatio: +(sb.width / sb.height).toFixed(3),
      imgW: Math.round(ib.width), imgH: Math.round(ib.height),
      imgRatio: +(ib.width / ib.height).toFixed(3),
      loaded,
      effDpr: variantW ? +(variantW / ib.width).toFixed(2) : null,
      shapeW: shb ? Math.round(shb.width) : 0,
      shapeH: shb ? Math.round(shb.height) : 0,
      faceTop: Math.round(ib.top - sb.top),
      overflow: docOverflow,
      glow: !!document.querySelector('[data-testid="stage-glow"]'),
      blob: !!document.querySelector('[data-testid="stage-blob"]'),
      decor: !!document.querySelector('[data-testid="stage-decor"]'),
      altLen: (img.getAttribute('alt') || '').length,
    };
  });
  if (r) rows.push({ name, ...r });

  fs.mkdirSync('shots/stage', { recursive: true });
  await page.evaluate(() => document.querySelector('[data-testid="portrait-stage"]')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(600);
  // Clip the screenshot to the stage bounds so Gate 1 shows the composition.
  const stage = await page.$('[data-testid="portrait-stage"]');
  if (stage) await stage.screenshot({ path: `shots/stage/${name}.png` });
  else await page.screenshot({ path: `shots/stage/${name}.png` });
  await page.context().close();
}

console.log(pad('viewport', 11) + pad('stage WxH', 12) + pad('sRatio', 8) + pad('img WxH', 11) + pad('iRatio', 8) + pad('loaded', 12) + pad('effDPR', 8) + pad('shape', 11) + pad('faceTop', 8) + pad('ovf', 5));
console.log('-'.repeat(100));
for (const r of rows) {
  console.log(pad(r.name, 11) + pad(`${r.stageW} x ${r.stageH}`, 12) + pad(r.stageRatio, 8) +
    pad(`${r.imgW} x ${r.imgH}`, 11) + pad(r.imgRatio, 8) + pad(r.loaded, 12) + pad(r.effDpr, 8) +
    pad(`${r.shapeW}x${r.shapeH}`, 11) + pad(r.faceTop, 8) + pad(r.overflow, 5));
}
const f = rows[0];
console.log(`\nlayers    : glow=${f.glow} blob=${f.blob} decor=${f.decor}   alt length: ${f.altLen}`);
console.log(`largest loaded: ${rows.at(-1).loaded} @ effDPR ${rows.at(-1).effDpr}`);

function pad(s, n) { return String(s).padEnd(n); }

await browser.close();