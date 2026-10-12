import { readFileSync } from 'node:fs';

// Field-by-field diff of two responsive-matrix runs, so a perf fix can be
// proven inert on layout rather than assumed.

const [beforePath, afterPath] = process.argv.slice(2);
const before = JSON.parse(readFileSync(beforePath, 'utf8'));
const after = JSON.parse(readFileSync(afterPath, 'utf8'));

const keys = Object.keys(after);
const FIELDS = [
  'scrollW',
  'clientW',
  'horizontalOverflow',
  'cls',
  'uses100vw',
  'scrollH',
];

let diffs = 0;
for (const k of keys) {
  const b = before[k];
  const a = after[k];
  if (!b) {
    console.log(`${k}: MISSING in before`);
    diffs++;
    continue;
  }
  for (const f of FIELDS) {
    if (b[f] !== a[f]) {
      console.log(`${k} :: ${f}  before=${b[f]}  after=${a[f]}`);
      diffs++;
    }
  }
  const bc = b.collisions?.length ?? 0;
  const ac = a.collisions?.length ?? 0;
  if (bc !== ac) {
    console.log(`${k} :: collisions before=${bc} after=${ac}`);
    diffs++;
  }
  const bt = b.tinyText?.length ?? 0;
  const at = a.tinyText?.length ?? 0;
  if (bt !== at) {
    console.log(`${k} :: tinyText before=${bt} after=${at}`);
    diffs++;
  }
  const bs = b.smallTargets?.length ?? 0;
  const as = a.smallTargets?.length ?? 0;
  if (bs !== as) {
    console.log(`${k} :: smallTargets before=${bs} after=${as}`);
    diffs++;
  }
  const be = b.pageErrors?.length ?? 0;
  const ae = a.pageErrors?.length ?? 0;
  if (be !== ae) {
    console.log(`${k} :: pageErrors before=${be} after=${ae}`);
    diffs++;
  }
}

const maxOverflow = Math.max(...keys.map((k) => after[k].horizontalOverflow ?? 0));
const errRuns = keys.filter((k) => (after[k].pageErrors?.length ?? 0) > 0);
const collRuns = keys.filter((k) => (after[k].collisions?.length ?? 0) > 0);

console.log(`\ncompared ${keys.length} runs across ${FIELDS.length + 5} fields`);
console.log(`differences: ${diffs}`);
console.log(`max horizontalOverflow after: ${maxOverflow}`);
console.log(`pageError runs after: ${errRuns.join(', ') || 'none'}`);
console.log(`collision runs after: ${collRuns.join(', ') || 'none'}`);