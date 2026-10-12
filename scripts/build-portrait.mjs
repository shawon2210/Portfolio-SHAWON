/**
 * MOBILE-FIRST v4 — PHASE 2: portrait variant generator
 *
 * Takes one master image (assets/portrait-source.jpg) and emits a 7:9
 * passport-ratio ladder in AVIF + WebP + JPEG into public/portrait/.
 *
 * Why the crop is baked in rather than left to CSS
 * ------------------------------------------------
 * The brief specifies `aspect-ratio: 7/9` + `object-fit: cover` +
 * `object-position: center top`. If the source is square and we rely on
 * `cover`, the browser crops to 7:9 *centred on the box*, which slices the
 * subject's shoulders asymmetrically at some sizes. Pre-cropping to exactly
 * 7:9 means the source ratio always equals the display ratio, so `cover`
 * becomes a no-op safety net and the face can never be clipped at any
 * viewport. `object-position` stays in the CSS as documentation of intent.
 *
 * Honest width ladder
 * -------------------
 * The current master is 800x800 SQUARE, so the widest honest 7:9 derivative is
 * 622px (800 * 7/9). Producing 960/1280 would mean upscaling, which produces a
 * soft, invented face — so this script refuses to. It emits only real
 * resolution and writes a manifest recording what is still missing.
 * Dropping in a >=1200x1543 master and re-running regenerates the full
 * 480/720/960/1280 ladder with no code change.
 *
 * Usage:  npm run portrait:build
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SOURCE = path.resolve('assets/portrait-source.jpg');
const OUT_DIR = path.resolve('public/portrait');
const MANIFEST = path.resolve('src/data/portraitManifest.ts');

// 7:9 passport ratio (35mm x 45mm).
const RATIO_W = 7;
const RATIO_H = 9;

// Target ladder. Anything wider than the master supports is emitted only if we
// genuinely have the pixels.
const LADDER = [240, 320, 400, 480, 560, 622, 720, 960, 1280];

// Quality per format, tuned for a face: AVIF carries most of the detail budget,
// WebP is the universal fallback, JPEG is last-resort for ancient browsers.
const QUALITY = { avif: 52, webp: 78, jpg: 82 };

const bytes = (n) => (n / 1024).toFixed(1) + ' KB';

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Missing source: ${SOURCE}\nSee RESPONSIVE_AUDIT.md §3 for the required spec.`);
    process.exit(1);
  }

  const src = sharp(SOURCE);
  const meta = await src.metadata();
  const srcW = meta.width;
  const srcH = meta.height;

  // Widest 7:9 derivative we can produce without upscaling.
  const maxHonestW = Math.floor(Math.min(srcW, (srcH * RATIO_W) / RATIO_H));

  console.log(`source : ${srcW}x${srcH} (${(srcW / srcH).toFixed(3)})`);
  console.log(`7:9    : widest honest derivative = ${maxHonestW}px wide`);
  if (maxHonestW < 1280) {
    console.log(
      `\n  !! TODO(asset): source is only ${srcW}px wide. The brief asks for\n` +
        `     960/1280 srcset entries (>=1200x1543 master). Those are NOT emitted\n` +
        `     because upscaling would invent detail. Re-run this script after\n` +
        `     supplying a >=1200x1543 7:9 master and the full ladder appears\n` +
        `     with no component change.\n`,
    );
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const widths = LADDER.filter((w) => w <= maxHonestW);
  const skipped = LADDER.filter((w) => w > maxHonestW);
  const produced = [];

  for (const w of widths) {
    // Crop square -> 7:9, centred horizontally, biased to the top so hair is
    // never shaved while keeping shoulder room below.
    const height = Math.round((w * RATIO_H) / RATIO_W);
    const pipeline = sharp(SOURCE)
      .resize({ width: w, height, fit: 'cover', position: 'top' })
      .modulate({ saturation: 1.02 })      // tiny lift; the studio shot is flat
      .linear(1.04, -4)                     // micro-contrast so the face reads
      .sharpen({ sigma: 0.7 });

    const entry = { width: w, height };
    for (const fmt of ['avif', 'webp', 'jpg']) {
      const file = `${w}.${fmt}`;
      const out = path.join(OUT_DIR, file);
      let img = pipeline.clone();
      if (fmt === 'avif') img = img.avif({ quality: QUALITY.avif, effort: 6 });
      else if (fmt === 'webp') img = img.webp({ quality: QUALITY.webp, effort: 5 });
      else img = img.jpeg({ quality: QUALITY.jpg, mozjpeg: true, chromaSubsampling: '4:4:4' });
      await img.toFile(out);
      entry[fmt] = { file: `/portrait/${file}`, bytes: fs.statSync(out).size };
    }
    produced.push(entry);
    console.log(
      `  ${String(w).padStart(4)}px  avif ${bytes(entry.avif.bytes).padStart(9)}  ` +
        `webp ${bytes(entry.webp.bytes).padStart(9)}  jpg ${bytes(entry.jpg.bytes).padStart(9)}`,
    );
  }

  // ---- budget check (brief: ~120 KB at the largest used variant) ----
  const largest = produced.at(-1);
  console.log(`\nbudget : largest variant ${largest.width}px -> avif ${bytes(largest.avif.bytes)}, webp ${bytes(largest.webp.bytes)}`);
  const overBudget = produced.filter((p) => p.avif.bytes > 120 * 1024);
  if (overBudget.length) {
    console.log(`  !! over the 120 KB avif budget: ${overBudget.map((p) => p.width + 'px').join(', ')}`);
  } else {
    console.log('  OK - every avif variant is under the 120 KB budget');
  }

  // ---- manifest consumed by <ProfilePortrait /> ----
  const ts = `/**
 * AUTO-GENERATED by scripts/build-portrait.mjs — do not edit by hand.
 * Regenerate with: npm run portrait:build
 *
 * Ratio is a true 7:9 passport crop (35x45mm). Every listed variant exists on
 * disk; the browser only ever requests files listed here, so there are no 404s.
 */

export const PORTRAIT_WIDTHS = [${produced.map((p) => p.width).join(', ')}] as const;

export const PORTRAIT_SRCSET = {
  avif: '${produced.map((p) => `/portrait/${p.width}.avif ${p.width}w`).join(', ')}',
  webp: '${produced.map((p) => `/portrait/${p.width}.webp ${p.width}w`).join(', ')}',
  jpg:  '${produced.map((p) => `/portrait/${p.width}.jpg ${p.width}w`).join(', ')}',
} as const;

/** Intrinsic size of the largest real variant, for width/height to avoid CLS. */
export const PORTRAIT_INTRINSIC = { width: ${largest.width}, height: ${largest.height} } as const;

/** Fallback <img src> — a mid-weight JPEG that every browser understands. */
export const PORTRAIT_FALLBACK_SRC = '/portrait/${Math.min(480, largest.width)}.jpg';

/** Widths requested by the brief but not producible without a larger source. */
export const PORTRAIT_MISSING_WIDTHS = [${skipped.join(', ')}] as const;
`;
  fs.writeFileSync(MANIFEST, ts);
  console.log(`\nwrote ${path.relative(process.cwd(), MANIFEST)}`);
  if (skipped.length) console.log(`TODO(asset): missing widths ${skipped.join(', ')} (need a >=1200x1543 master)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});