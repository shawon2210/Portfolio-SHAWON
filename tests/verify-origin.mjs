#!/usr/bin/env node
/**
 * Canonical-origin guard.
 *
 * Asserts that the site's own origin is declared in exactly one place per
 * runtime boundary, that both declarations agree, and that no shipped or
 * source file reintroduces a retired origin or a leaked build token.
 *
 * Third-party origins (schema.org, github.com, fonts.googleapis.com, deployed
 * showcase apps, npm registry, ...) are legitimate and deliberately ignored.
 *
 * Usage:
 *   node tests/verify-origin.mjs
 *   node tests/verify-origin.mjs --dist <dir>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const ORIGIN_TOKEN = '%SITE_ORIGIN%';
const TOKEN_RE = /%SITE_ORIGIN%/g;

/** Retired origins for this site. `shawon.dev` is an unrelated person's site. */
const RETIRED_ORIGINS = [
  'https://shawon.dev',
  'https://www.shawon.dev',
  'https://portfolio-shawon-six.vercel.app',
];

const ORIGIN_DECLARATIONS = ['vite.config.ts', 'src/config/site.ts'];
const SELF = path.resolve(root, 'tests/verify-origin.mjs');
const SITE_TS = path.resolve(root, 'src/config/site.ts');

const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.vscode',
  'coverage',
  'astro-site',
]);
const SKIP_FILES = new Set([
  SELF,
  path.resolve(root, 'package-lock.json'),
  path.resolve(root, 'astro-site/package-lock.json'),
]);
const SCAN_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.html', '.xml', '.txt', '.css']);

const violations = [];
const read = (p) => {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
};
const rel = (p) => path.relative(root, p) || path.basename(p);

/* ---------------------------------------------------------------- *
 * 1. Both declarations must exist, parse, and agree.
 * ---------------------------------------------------------------- */

function parseOrigin(file, label) {
  const raw = read(file);
  if (raw === null) {
    violations.push(`${label}: missing`);
    return null;
  }

  // Strip comments so prose mentions of SITE_ORIGIN are never parsed as code.
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');

  const assignment = text.match(/(?:^|\n)\s*(?:export\s+)?const\s+SITE_ORIGIN\s*=\s*([^;\n]+)/);
  if (!assignment) {
    violations.push(`${label}: no SITE_ORIGIN declaration found`);
    return null;
  }

  // Handles both `= 'https://host'` and
  // `= (process.env.SITE_ORIGIN ?? 'https://host').replace(...)`.
  const literals = assignment[1].match(/['"](https?:\/\/[^'"\s]+)['"]/g) ?? [];
  if (literals.length === 0) {
    violations.push(`${label}: SITE_ORIGIN has no origin literal default -> ${assignment[1].trim()}`);
    return null;
  }

  const value = literals[literals.length - 1].slice(1, -1).trim();
  if (!/^https?:\/\/[^/\s]+$/.test(value)) {
    violations.push(`${label}: SITE_ORIGIN default is not a bare origin -> ${value}`);
    return null;
  }
  return value;
}

const viteOrigin = parseOrigin(path.resolve(root, 'vite.config.ts'), 'vite.config.ts');
const siteOrigin = parseOrigin(SITE_TS, 'src/config/site.ts');

if (viteOrigin && siteOrigin && viteOrigin !== siteOrigin) {
  violations.push(
    `origin declarations disagree:\n` +
      `      vite.config.ts    -> ${viteOrigin}\n` +
      `      src/config/site.ts -> ${siteOrigin}`,
  );
}

const canonical = viteOrigin ?? siteOrigin;
if (canonical) {
  console.log(`canonical origin: ${canonical}`);
  if (canonical.endsWith('.vercel.app')) {
    console.log(
      'note: canonical is a Vercel alias (no custom domain attached). ' +
        'Rebuild with SITE_ORIGIN set once a custom domain is added.',
    );
  }
}

/* ---------------------------------------------------------------- *
 * 2. Scan tracked source/static files.
 *    a) no retired origin may be referenced
 *    b) the canonical origin may only appear in its declaration files
 * ---------------------------------------------------------------- */

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

const allowedCanonical = new Set(ORIGIN_DECLARATIONS.map((f) => path.resolve(root, f)));
let scannedFiles = 0;

for (const file of walk(root)) {
  if (SKIP_FILES.has(file)) continue;
  if (!SCAN_EXT.has(path.extname(file).toLowerCase())) continue;
  if (allowedCanonical.has(file)) continue;

  const text = read(file);
  if (text === null) continue;
  scannedFiles += 1;

  for (const retired of RETIRED_ORIGINS) {
    let idx = text.indexOf(retired);
    while (idx !== -1) {
      violations.push(`${rel(file)}: retired origin ${retired}`);
      idx = text.indexOf(retired, idx + retired.length);
    }
  }

  if (canonical) {
    let idx = text.indexOf(canonical);
    while (idx !== -1) {
      violations.push(`${rel(file)}: hardcoded canonical origin ${canonical}`);
      idx = text.indexOf(canonical, idx + canonical.length);
    }
  }
}

/* ---------------------------------------------------------------- *
 * 3. Smoke-test target must track the canonical origin.
 * ---------------------------------------------------------------- */

const smoke = read(path.resolve(root, 'tests/smoke-production.mjs'));
if (smoke === null) {
  violations.push('tests/smoke-production.mjs: missing');
} else if (/process\.argv\[2\]\s*\?\?\s*['"]https?:\/\//.test(smoke)) {
  violations.push(
    'tests/smoke-production.mjs: default target must derive from src/config/site.ts, not a literal origin',
  );
}

/* ---------------------------------------------------------------- *
 * 4. Build output: no leaked tokens, no retired origins.
 * ---------------------------------------------------------------- */

const distArg = process.argv.indexOf('--dist');
const distDir = path.resolve(root, distArg !== -1 ? process.argv[distArg + 1] : 'dist');

if (fs.existsSync(distDir)) {
  for (const file of walk(distDir)) {
    const text = read(file);
    if (text === null) continue;

    TOKEN_RE.lastIndex = 0;
    const leaks = text.match(TOKEN_RE);
    if (leaks) {
      violations.push(`${rel(file)}: ${leaks.length} leaked ${ORIGIN_TOKEN} token(s)`);
    }

    for (const retired of RETIRED_ORIGINS) {
      if (text.includes(retired)) {
        violations.push(`${rel(file)}: retired origin ${retired} in build output`);
      }
    }

    if (canonical && !ORIGIN_DECLARATIONS.includes(rel(file)) && text.includes(canonical)) {
      const outsideHtmlLike = !/\.(html|xml|txt|json|js|css)$/i.test(file);
      if (outsideHtmlLike) {
        violations.push(`${rel(file)}: unexpected canonical origin in ${path.extname(file)} asset`);
      }
    }
  }
  console.log(`scanned dist: ${rel(distDir)}`);
} else {
  console.log(`dist not present at ${rel(distDir)}; skipped build-output checks (run \`npm run build\` first)`);
}

/* ---------------------------------------------------------------- *
 * Result
 * ---------------------------------------------------------------- */

console.log(`scanned ${scannedFiles} source/static files`);

if (violations.length > 0) {
  console.error(`\norigin guard failed (${violations.length}):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log('origin guard passed: declarations agree, no retired origins, no leaked tokens.');