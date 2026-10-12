import fs from 'node:fs';
const R = JSON.parse(fs.readFileSync('tests/.artifacts/matrix.json', 'utf8'));
const rows = Object.values(R);

const pad = (s, n) => String(s).padEnd(n);
const num = (n, d = 0) => (n === null || n === undefined ? '—' : Number(n).toFixed(d));

console.log('=== 1. HORIZONTAL OVERFLOW BY VIEWPORT/ENGINE ===');
console.log(pad('viewport', 12), pad('engine', 9), pad('clientW', 9), pad('scrollW', 9), pad('overflow', 9), pad('suspectWidth', 13));
const suspects = [];
for (const r of rows) {
  const ov = r.horizontalOverflow;
  const sum = ov > 0 ? r.vw + ov : 0;
  console.log(pad(r.viewport.name, 12), pad(r.engine, 9), pad(r.clientW, 9), pad(r.scrollW, 9), pad(ov > 0 ? '+' + ov : '0', 9), pad(ov > 0 ? sum + 'px' : '—', 13));
  if (ov > 0) suspects.push(sum);
}
if (suspects.length) {
  const uniq = [...new Set(suspects)].sort((a, b) => a - b);
  console.log(`\n  candidate fixed-width culprit(s): ${uniq.join('px, ')}px`);
}

console.log('\n=== 2. OVERFLOW OFFENDERS (unique selectors, webkit) ===');
const offMap = new Map();
for (const r of rows) {
  for (const o of r.offenders) {
    const key = o.selector;
    if (!offMap.has(key)) offMap.set(key, { count: 0, max: 0, sample: o, vps: [] });
    const e = offMap.get(key);
    e.count++; e.vps.push(r.viewport.name + '/' + r.engine);
    e.max = Math.max(e.max, o.overRight, o.overLeft);
  }
}
for (const [sel, e] of [...offMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 14)) {
  console.log(`  ${pad(sel.slice(0, 66), 68)} seen=${pad(e.count, 3)} maxOver=${pad(e.max + 'px', 7)} pos=${e.sample.position} fullBleed=${e.sample.fullBleed}`);
}

console.log('\n=== 3. PORTRAIT MEASUREMENTS ===');
console.log(pad('viewport', 12), pad('engine', 8), pad('dispW', 7), pad('dispH', 7), pad('ratio', 7), pad('%VW', 7), pad('area', 8), pad('natural', 9), pad('effDPR', 8), pad('srcset', 7), pad('wh', 4));
for (const r of rows) {
  const p = r.portrait;
  if (!p) { console.log(pad(r.viewport.name, 12), pad(r.engine, 8), 'NOT DETECTED'); continue; }
  console.log(
    pad(r.viewport.name, 12), pad(r.engine, 8),
    pad(p.displayedW, 7), pad(p.displayedH, 7), pad(num(p.ratio, 3), 7),
    pad(p.pctOfViewport + '%', 7), pad(p.displayedAreaPx, 8),
    pad(`${p.naturalW}x${p.naturalH}`, 9), pad(num(p.effectiveDpr, 2), 8),
    pad(p.hasSrcset ? 'yes' : 'NO', 7), pad(p.hasWHattrs ? 'y' : 'n', 4),
  );
}

console.log('\n=== 4. TEXT BELOW SIZE FLOOR ===');
const tinyMap = new Map();
for (const r of rows) for (const t of r.tinyText) {
  const k = t.selector + ' @ ' + t.px + 'px';
  tinyMap.set(k, (tinyMap.get(k) || 0) + 1);
}
for (const [k, n] of [...tinyMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)) console.log(`  ${pad(k.slice(0, 72), 74)} x${n}`);
if (!tinyMap.size) console.log('  none');

console.log('\n=== 5. INTERACTIVE TARGETS < 44x44 ===');
const tgtMap = new Map();
for (const r of rows) for (const t of r.smallTargets) {
  const k = `${t.selector}  "${t.label}"  ${t.w}x${t.h}`;
  if (!tgtMap.has(k)) tgtMap.set(k, { count: 0, need: t.need, vps: [] });
  tgtMap.get(k).count++; tgtMap.get(k).vps.push(r.viewport.name + '/' + r.engine);
}
for (const [k, v] of [...tgtMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 24)) {
  console.log(`  ${pad(k.slice(0, 70), 72)} x${pad(v.count, 3)} need +${v.need}`);
}
if (!tgtMap.size) console.log('  none');

console.log('\n=== 6. FORM INPUTS < 16px (iOS zoom) ===');
const inpMap = new Map();
for (const r of rows) for (const t of r.smallInputs) {
  const k = `${t.selector} ${t.name} ${t.px}px`;
  inpMap.set(k, (inpMap.get(k) || 0) + 1);
}
for (const [k, n] of [...inpMap.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${pad(k.slice(0, 70), 72)} x${n}`);
if (!inpMap.size) console.log('  none');

console.log('\n=== 7. CHROME COLLISIONS ===');
const colMap = new Map();
for (const r of rows) for (const c of r.collisions) {
  const k = `${c.chrome} (z${c.chromeZ}) covers ${c.covering}`;
  colMap.set(k, (colMap.get(k) || 0) + 1);
}
for (const [k, n] of [...colMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16)) console.log(`  ${pad(k.slice(0, 76), 78)} x${n}`);
if (!colMap.size) console.log('  none');

console.log('\n=== 8. PAGE ERRORS + CONSOLE ===');
for (const r of rows) {
  if (r.pageErrors.length || r.consoleMsgs.length) {
    console.log(`  ${r.viewport.name}/${r.engine}:`);
    for (const e of r.pageErrors) console.log(`     PAGEERROR: ${e.slice(0, 120)}`);
    const seen = new Set();
    for (const c of r.consoleMsgs) { const k = c.type + c.text.slice(0, 60); if (!seen.has(k)) { seen.add(k); console.log(`     ${c.type}: ${c.text.slice(0, 110)}`); } }
  }
}

console.log('\n=== 9. CLS / FPS ===');
console.log(pad('viewport', 12), pad('engine', 8), pad('cls', 8), 'fps');
for (const r of rows) console.log(pad(r.viewport.name, 12), pad(r.engine, 8), pad(num(r.cls, 4), 8), r.fps ?? '—');

console.log('\n=== 10. Z-INDEX INVENTORY (top) ===');
const zMap = new Map();
for (const r of rows) for (const z of r.zIndex) {
  const k = `${pad(z.z, 5)} ${z.selector.slice(0, 58)}`;
  if (!zMap.has(k)) zMap.set(k, 0);
  zMap.set(k, zMap.get(k) + 1);
}
for (const [k, n] of [...zMap.entries()].sort((a, b) => parseInt(b[0]) - parseInt(a[0])).slice(0, 20)) console.log(`  ${k}  (x${n})`);

console.log('\n=== 11. PER-SECTION OVERFLOW (webkit phones) ===');
for (const r of rows.filter((x) => x.engine === 'webkit' && x.viewport.kind === 'phone')) {
  const bad = Object.entries(r.perSection).filter(([, s]) => s.horizontalOverflow > 0).map(([k, s]) => `${k}+${s.horizontalOverflow}`);
  console.log(`  ${pad(r.viewport.name, 12)} ${bad.length ? bad.join(', ') : 'clean'}`);
}