# RESPONSIVE AUDIT — PHASE 0

**Branch:** `portfolio-mobile-first-v4`
**Base commit:** `623e590` (`[GLOBAL-P5]`, deployed to production)
**Target:** production build via `vite preview` (`npm run build && npm run preview`), **not** the dev server
**Engines:** Chromium 1.64.0 + WebKit 27.2 (Safari engine)
**Matrix:** 18 viewports × 2 engines = **36 runs**
**Date:** 2026-10-12

> **Phase 0 is audit-only. No product code was changed.** Only test infrastructure was added.

---

## 0. How to reproduce

```bash
npm install                      # adds @playwright/test + playwright (devDependencies only)
npx playwright install chromium webkit
npm run build
npm run test:responsive          # rebuilds + previews on :4183, writes tests/.artifacts/
```

Artifacts land in `tests/.artifacts/`:

| Path | Contents |
|---|---|
| `matrix.json` | merged machine-readable findings for all 36 runs |
| `runs/<viewport>__<engine>.json` | per-run raw output (written by parallel workers) |
| `screens/<viewport>/<engine>-fold.png` | above-the-fold capture |
| `screens/<viewport>/<engine>-full.png` | full-page capture |

Screenshots are **173.9 MB across 70 files** and are therefore **gitignored**. Regenerate with the command above. Only the suite is committed.

### ⚠️ Methodology defect found and fixed during this phase

The first full matrix run produced **invalid results**. Playwright's `reuseExistingServer: true` bound to a leftover `vite preview` process on port 4173 left over from the Phase 5 benchmarking session, which was serving a **stale pre-Phase-5 build from a temp directory**.

Evidence that it was stale — the served HTML had none of the Phase 5 work:

```
theme-color        : False
og:image:secure_url: False
@graph JSON-LD     : False
```

Lighthouse against that stale build reported a11y **95** with `color-contrast`, `heading-order` and `label-content-name-mismatch` failing — all three of which Phase 5 had explicitly fixed. That contradiction is what exposed the bad server.

Fixes applied to the harness:

1. Dedicated audit port **4183** (was colliding with 4173).
2. `reuseExistingServer: false`.
3. `command: 'npm run build && npm run preview …'` so the audit can never run against a stale bundle.
4. **Every downstream number in this document is from the corrected build**, re-verified by asserting `theme-color` / `og:image:secure_url` / `@graph` are present in the served HTML.

The horizontal-overflow finding was independently **re-run and reproduced identically** on the corrected build.

---

## 1. Baseline scores (current build, commit `623e590`)

| | Performance | A11y | Best Practices | SEO | FCP | LCP | TBT | CLS | SI | TTI |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **Mobile** | **84** | **100** | **100** | **100** | 2.6 s | 3.0 s | 280 ms | 0.014 | 3.2 s | 3.7 s |
| **Desktop** | **98** | **100** | **100** | **100** | 0.6 s | 0.7 s | 30 ms | 0 | 1.3 s | 0.8 s |

Mobile INP proxy (12 scripted taps, `PerformanceObserver` `event` timing): **worst 48 ms · p95 48 ms · median 24 ms** — comfortably inside the 200 ms budget.

### Failing audits (mobile)

| Audit | Score | Phase 4 verdict |
|---|---:|---|
| `forced-reflow-insight` | 0 | **Real.** Should have been fixed in Phase 4 — still firing. |
| `unused-javascript` (77 KiB) | 0 | `three-vendor`, see §4 |
| `mainthread-work-breakdown`, `bootup-time` | 0 | 3D init + React |
| `cache-insight`, `image-delivery-insight` | 0.5 / 0 | remote `lh3.googleusercontent.com` project shots |
| `render-blocking-insight` | 0.5 | single CSS file |
| `network-dependency-tree-insight` | 0 | structural (4 vendor chunks) |
| `valid-source-maps` | 0 | build-config choice, not a defect |
| `max-potential-fid` | 0.29 | 330 ms |

Note `color-contrast`, `heading-order`, `label-content-name-mismatch` and `llms-txt` **pass** on the corrected build — consistent with Phase 5.

---

## 2. Prioritized issue list

Severity: **P0** blocks the brief · **P1** major · **P2** moderate · **P3** minor

| ID | Sev | Issue | Viewports | Evidence | Proposed fix |
|---|---|---|---|---|---|
| **R-01** | **P0** | **Profile portrait renders at 48×48 px on phones** — a thumbnail, not a portrait | all | measured 48px (11–15 % of VW) phone, 56px (2.2–7.3 %) desktop | Phase 2: canonical `<ProfilePortrait />`, ≥200px phone / ≥320px desktop |
| **R-02** | **P0** | **Portrait source asset is 800×800 square, 41.5 KB WebP** — cannot deliver 7:9 at ≥1200px, or 2× sharpness at 420px | all | `mdshawonmolla-v2.webp` = 800×800, ratio 1.000 vs required 0.778 | **`TODO(asset)`** — see §3 |
| **R-03** | **P0** | **Horizontal overflow +79…+189 px on all six phone widths** (320–430), both engines | 320, 360, 375, 390, 412, 430 | `documentElement.scrollWidth` pinned at **509 px** at every width | Phase 1: wrap/scroll the Experience filter row |
| **R-04** | **P1** | **Experience filter pills don't wrap** → root cause of R-03 | 320–430 | `src/views/ExperienceView.tsx:58` `flex items-center gap-1.5` (no `flex-wrap`, no `overflow-x`) | add `flex-wrap` or `overflow-x-auto no-scrollbar` — mirror `ProjectsView.tsx:110` which already does it correctly |
| **R-05** | **P1** | **Fixed header stretches to document width** (509px at a 320px viewport) | 320–430 | `header.fixed.top-0` computed `width: 509px` | symptom of R-03; resolve together |
| **R-06** | **P1** | **33 touch targets under 44×44 px** | all | worst: social link **14×14** (+30/+30), "Live" **26×16**, "Inspect Code →" **92×16**, `a.w-8.h-8` **32×32**, `a.w-10.h-10` **40×40** | Phase 1/3: padding or `::after` hit areas, 8px spacing |
| **R-07** | **P1** | **All 5 form inputs under 16 px** → iOS Safari zooms on focus | 320–430 | contact name/email/subject/message **14 px**, project filter **12 px** | Phase 3: `min-height`, `font-size: 16px` on mobile |
| **R-08** | **P1** | **WebGL context loss is unhandled** → unhandled rejection | 360, 430 (WebKit) | `WebGL: context lost.` + `TypeError: null is not an object (evaluating 'e.getShaderPrecisionFormat…')` from `THREE.WebGLRenderer` | Phase 4: add `webglcontextlost`/`restored` listeners, guard renderer init |
| **R-09** | **P1** | **19 text nodes below the 14px/12px floor**, incl. **9 px** | all | `span.font-mono.text-[9px]`, `.text-[10px]`, `.text-[11px].font-mono` (location line), `p.text-xs.text-slate-300` | Phase 3: raise floors; keep genuinely decorative numerals as `aria-hidden` |
| **R-10** | **P1** | **Mobile nav overlaps a CTA button** | 320–430 | `nav.md:hidden.fixed (z-50)` covers `button.inline-block.bg-transparent` ×6 runs | Phase 1: z-index scale + spacing |
| **R-11** | **P2** | **No `data-testid` hooks anywhere in the codebase** | — | grep count = **0** | Required by the brief before Phase 3/5 tests can be written |
| **R-12** | **P2** | **Canvas DPR uncapped at 2.75 on mobile** | phones | backing store **763×1413** = 1.08 Mpx for a CSS area of 509×942 | Phase 4: cap DPR 1.5 (1.0 on weak tier) per brief |
| **R-13** | **P2** | **3D FPS 29 @ 4× CPU throttle** | phones | Pixel 5: 59.8 @1× → **29.0 @4×**, p95 frame 56.7 ms, 9 frames >50 ms | Phase 4 tier ladder |
| **R-14** | **P2** | **Portrait has no `srcset`/`sizes`**; effective DPR **16.67** (800px source into a 48px box) | all | `hasSrcset: NO`, `effectiveDpr: 16.67` | Phase 2: `<picture>` + `srcset` 480/720/960/1280 |
| **R-15** | **P3** | **No documented z-index scale** — header and mobile nav both `z-50` | all | z-inventory: 50/50/40/30/20/10 | Phase 1: token scale |
| **R-16** | **P3** | **Chromium WebGL "GPU stall due to ReadPixels"** warnings | 1024×1366, 320, 430, 667×375 | GL driver performance warning | investigate `readPixels` usage in the scene |
| **R-17** | **P3** | Lighthouse CLS **0.014** vs real-browser **0.0000** | mobile | 0 layout shifts across all 36 runs | known emulation artifact (Phase 4 §9.5); no action |

**Not defects (verified):**
- Reduced motion is correct — no preloader, no cursor follower mounted, `body{cursor:auto}`, no session writes, `scroll-behavior:auto`.
- Single WebGL context preserved (`contexts: 1`).
- No horizontal overflow at ≥600px, on any tablet, desktop or landscape viewport, on either engine.

---

## 3. Profile portrait — source vs displayed

| | Value |
|---|---|
| Source file | `public/mdshawonmolla-v2.webp` (and a `.jpg` twin) |
| Source resolution | **800 × 800** |
| Source ratio | **1.000** (square) |
| File size | 41.5 KB WebP · 64.9 KB JPEG |
| Formats present | WebP + JPEG only — **no AVIF** |
| `srcset` / `sizes` | **absent** |
| `width`/`height` attrs | present (`800`/`800`) — ratio does not match the 7:9 target |
| `fetchpriority` | `high` ✅ |
| `decoding` | `async` ✅ |
| Rendered markup | `HomeView.tsx:134` — `w-12 h-12 sm:w-14 sm:h-14` (48/56 px) |

### Rendered size at every viewport (identical on Chromium and WebKit)

| Viewport | Rendered | Ratio | % of viewport width | Area | Eff. DPR |
|---|---:|---:|---:|---:|---:|
| 320×568 | **48×48** | 1.000 | 15.0 % | 2 304 px² | 16.67 |
| 360×640 | **48×48** | 1.000 | 13.3 % | 2 304 px² | 16.67 |
| 375×667 | **48×48** | 1.000 | 12.8 % | 2 304 px² | 16.67 |
| 390×844 | **48×48** | 1.000 | 12.3 % | 2 304 px² | 16.67 |
| 412×915 | **48×48** | 1.000 | 11.7 % | 2 304 px² | 16.67 |
| 430×932 | **48×48** | 1.000 | 11.2 % | 2 304 px² | 16.67 |
| 600×960 | **48×48** | 1.000 | 8.0 % | 2 304 px² | 16.67 |
| 667×375 | 56×56 | 1.000 | 8.4 % | 3 136 px² | 14.29 |
| 768×1024 | 56×56 | 1.000 | 7.3 % | 3 136 px² | 14.29 |
| 820×1180 | 56×56 | 1.000 | 6.8 % | 3 136 px² | 14.29 |
| 844×390 | 56×56 | 1.000 | 6.6 % | 3 136 px² | 14.29 |
| 915×412 | 56×56 | 1.000 | 6.1 % | 3 136 px² | 14.29 |
| 1024×1366 | 56×56 | 1.000 | 5.5 % | 3 136 px² | 14.29 |
| 1280×720 | 56×56 | 1.000 | 4.4 % | 3 136 px² | 14.29 |
| 1440×900 | 56×56 | 1.000 | 3.9 % | 3 136 px² | 14.29 |
| 1920×1080 | 56×56 | 1.000 | 2.9 % | 3 136 px² | 14.29 |
| 2560×1440 | 56×56 | 1.000 | 2.2 % | 3 136 px² | 14.29 |

**Two independent problems:**
1. **Too small** — 48 px is an avatar chip, not a passport portrait. At 2560×1440 it occupies **2.2 %** of the viewport width.
2. **Wrong source** — 800×800 square cannot fill a 7:9 box without cropping the sides, and cannot reach the required sharpness: at a 420 px desktop size the brief needs 840 px of source for 2× (have 800) and 1260 px for 3×.

### `TODO(asset)` — what I need from you

**Supply one replacement portrait.** The current file cannot be stretched to meet the spec.

| Property | Required | Current |
|---|---|---|
| Width | **≥ 960 px** (ideal **1200 px**) | 800 px ❌ |
| Aspect ratio | **7:9** portrait → ideal **1200 × 1543 px** | 1:1 square ❌ |
| Orientation | Head-and-shoulders, face centred horizontally | — |
| Background | Plain, or removable/clean (so `object-position: center top` never crops the face) | — |
| Format | I'll generate AVIF + WebP + JPEG derivatives; supply PNG or the highest-quality JPEG you have | WebP 41.5 KB / JPEG 64.9 KB |

Budget: ~120 KB at the largest used variant. I will not over-compress — face detail matters more than a few KB.

If you can only supply the current 800×800 file, I can still ship the 7:9 frame and the responsive sizing, but 2×+ screens will show a slightly soft face and `object-fit: cover` will crop the sides of a square frame. **Please supply the 1200×1543 version.**

---

## 4. R-03 root cause — proven, not guessed

`documentElement.scrollWidth` is pinned at **509 px at every phone width**, so the overflow is a fixed-width element, not a fluid one.

Bisect result (hide each candidate, re-measure `scrollWidth`):

| Element hidden | scrollWidth after | Reading |
|---|---:|---|
| baseline | 509 | — |
| `<header.fixed>` | 509 | header is a **symptom**, not the cause |
| `div.fixed.inset-0.z-0` (3D scene) | 509 | not the cause |
| marquee `<section>` | 509 | `overflow-hidden` clips it — red herring |
| **`<main>`** | **320** | ✅ culprit is inside `<main>` |

Narrowing inside `<main>`, hiding individual elements:

| Hidden element | scrollWidth | Its rect |
|---|---:|---|
| pill `<span>` "Academic & Degrees" | 376 | 133×16 at x=359 |
| last filter `<button>` | **320** ✅ | 186×30 at x=151 |
| filter row `div.flex.items-center.gap-1.5` | 336 | 167×30 at x=342 |

**Culprit:** `src/views/ExperienceView.tsx:58`

```jsx
<div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-white/[0.08]">
```

A non-wrapping row of filter pills. `ProjectsView.tsx:110` solves the identical problem correctly with `flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1` — the Experience row simply never got that treatment.

The overflow is identical on **Chromium and WebKit** (12 of 36 runs), and identical in **all four sections** at each width — consistent with one persistent element, not a per-section layout bug.

---

## 5. Per-viewport summary

| Viewport | Overflow | CLS | FPS\* |
|---|---:|---:|---:|
| 320×568 | **+189** | 0 | — |
| 360×640 | **+149** | 0 | — |
| 375×667 | **+134** | 0 | — |
| 390×844 | **+119** | 0 | — |
| 412×915 | **+97** | 0 | — |
| 430×932 | **+79** | 0 | — |
| 600×960 | 0 | 0 | — |
| 667×375 | 0 | 0 | — |
| 768×1024 | 0 | 0 | — |
| 820×1180 | 0 | 0 | — |
| 844×390 | 0 | 0 | — |
| 915×412 | 0 | 0 | — |
| 1024×1366 | 0 | 0 | — |
| 1024×768 | 0 | 0 | — |
| 1280×720 | 0 | 0 | — |
| 1440×900 | 0 | 0 | — |
| 1920×1080 | 0 | 0 | — |
| 2560×1440 | 0 | 0 | — |

\* **The in-matrix FPS column is unreliable and should be ignored.** It samples a single scroll position after settle, and returned values as low as 6.6 FPS that contradict the controlled measurement. The authoritative figure is the dedicated run in §6.

---

## 6. 3D performance & WebGL

Authoritative measurement, Pixel 5 profile, full scroll sweep:

| CPU throttle | FPS | p50 | p95 | worst | frames >50 ms |
|---|---:|---:|---:|---:|---:|
| 1× | **59.8** | 16.6 ms | 18.5 ms | 43.3 ms | 0 / 240 |
| **4×** | **29.0** | 29.5 ms | 56.7 ms | 138.9 ms | **9 / 117** |

At 4× the scene falls to **29 FPS**, well under the 45 FPS downgrade threshold — so the Phase 4 tier ladder should engage, but 29 FPS is still a poor result on a throttled mid-tier phone (R-13).

| Property | Value | Note |
|---|---|---|
| Canvas count | **1** | single-WebGL-context rule preserved ✅ |
| Backing store | **763 × 1413** (1.08 Mpx) | |
| CSS size | 509 × 942 | note 509px = the overflow, so the canvas is being stretched too |
| DPR | **2.75** | uncapped — brief requires ≤1.5 on phones (R-12) |
| Renderer | `WebKit WebGL` (WebKit) / ANGLE (Chromium) | |

### WebGL context loss (R-08)

Reproduced on **WebKit at 360×640 and 430×932**:

```
error: WebGL: context lost.
Unhandled Promise Rejection: TypeError: null is not an object
  (evaluating 'e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT)')
THREE.WebGLRenderer: null is not an object
```

The renderer is constructed against a context that has already been lost, and nothing listens for `webglcontextlost`. On a real iPhone this surfaces as a blank hero with a console error.

---

## 7. Accessibility & touch findings

### Text below the size floor (present in all 36 runs)

| Selector | Size | Notes |
|---|---:|---|
| `span.font-mono.text-[9px]` | **9 px** | worst offender, below even the 12px caption floor |
| `span.font-mono.text-[10px]`, `.text-[10px]` | **10 px** | |
| `span.text-[11px].font-mono`, `.block.text-[11px]`, `.inline-flex…` | **11 px** | includes the hero location line `Dhaka, Bangladesh • Remote Available` |
| `p.text-xs.text-slate-300`, `span.text-slate-300`, `span.text-sky-400…`, `span.text-slate-200.font-medium`, `strong.font-semibold` | **12 px** | at the caption floor, acceptable — but several are body copy |

### Touch targets under 44×44 (33 distinct)

| Element | Measured | Needs |
|---|---:|---|
| `a.text-slate-400.hover:text-white` (social) | **14×14** | +30w +30h |
| `a.text-xs.font-mono` "Live" | **26×16** | +18w +28h |
| `button.font-mono.text-xs` "Inspect Code →" | **92×16** | +0w +28h |
| `a.w-8.h-8` "GitHub Profile" | **32×32** | +12w +12h |
| `a.w-10.h-10` | **40×40** | +4w +4h |
| `button.inline-flex…` "GitHub" / "LinkedIn" / email | 110×34 … 189×34 | +10h |
| filter pills (`All Systems6`, `Full-Stack`, `AI & ML`, `Backend & Cloud`) | 40–42 px tall | +2…+4h |
| CTA buttons "Explore Projects" / "Inspect CV Resume" / "Schedule Interview" | 42 px tall | +2h |
| mobile dock items "Home"/"Projects"/"Experience"/"Contact" | 40 px tall | +4h |
| brand button | 32 px tall | +12h |

### Form inputs (all below the 16px iOS zoom threshold)

| Field | Size |
|---|---:|
| project filter `input` | **12 px** |
| `contact-name` | **14 px** |
| `contact-email` | **14 px** |
| `contact-subject` | **14 px** |
| `contact-message` | **14 px** |

### Chrome collision

```
nav.md:hidden.fixed (z-50)  covers  button.inline-block.bg-transparent   ×6 runs
```

The mobile nav sits over a CTA button at every phone width.

### Z-index inventory (no scale exists)

| z | Element | Count |
|---:|---|---:|
| 50 | `header.fixed.top-0` | 34 |
| 50 | `nav.md:hidden.fixed` | 16 |
| 40 | `div.fixed.bottom-5` (mobile dock) | 22 |
| 30 | `section.relative.w-full` | 36 |
| 20 | `div.relative.z-20` | 142 |
| 10 | `span.relative.z-10` | 184 |

Header and mobile nav share `z-50`; dock is `z-40`; there is no token scale.

---

## 8. Reduced motion — verified correct

| Check | Result |
|---|---|
| Preloader rendered | ❌ never mounts |
| Cursor follower mounted | ❌ no (`body{cursor:auto}`, 0 `mix-blend-mode` elements) |
| `sessionStorage` written | ❌ none |
| `scroll-behavior` on `<html>` | `auto` |

*(An earlier automated check reported `cursorMounted: true`. That was a false positive in my own probe — the selector `[class*="cursor"]` matched the ubiquitous `cursor-pointer` Tailwind utility on ordinary buttons. Re-verified with a structural selector: the follower is genuinely absent.)*

---

## 9. Files added (test infrastructure only)

```
tests/playwright.config.js        Chromium + WebKit, rebuild-on-run, port 4183
tests/specs/responsive.spec.js    36-run matrix (18 viewports × 2 engines)
tests/specs/_collect.js           in-page measurement collector
tests/analyze.mjs                 matrix.json → tables
tests/probe-*.mjs                 root-cause probes (overflow, header, bisect)
tests/perf.mjs                    FPS / WebGL / reduced-motion / INP
package.json                      + @playwright/test, + playwright (devDependencies)
.gitignore                        + tests/.artifacts/
```

No `src/` file was modified in Phase 0.

---

## 10. Recommended Phase 1 order

1. **R-04** — one-line fix that clears R-03 and R-05 (12 of 36 runs).
2. **R-06 / R-07** — touch targets and 16px inputs; these are pure accessibility wins.
3. **R-11** — add `data-testid` hooks now, so Phase 3 and Phase 5 tests can be written against stable selectors instead of class-name regexes.
4. **R-15** — z-index token scale, to resolve R-10.
5. Fluid type/spacing/container system, `svh/dvh`, safe-area insets, `xs`/`3xl` breakpoints.

---

## GATE

**Phase 0 complete — awaiting approval.**

**Blocking on you before Phase 2:** the replacement portrait asset described in §3 (ideally **1200 × 1543 px, 7:9**). Phases 1 can start without it; Phase 2 cannot ship a sharp result without it.