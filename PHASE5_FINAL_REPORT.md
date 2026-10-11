# PHASE 5 — GLOBAL POLISH: FINAL REPORT

**Project:** Shawon.dev Portfolio
**Baseline:** `38556a5` — end of Phase 4 (Sections / cinematic)
**Target:** `working tree` — Phase 5 (Global Polish)
**Date:** 2026-10-12
**Method:** Lighthouse CLI 13.4.1, Chrome (headless=new, SwiftShader), Playwright 1.x CDP. Before/after builds served by `vite preview` on ports 4173 / 4174 from the same machine, same network, same Chrome. Mobile = Lighthouse default (Moto G Power, 4× CPU, 1.6 Mbps, 150 ms RTT). Numbers below are **medians of 3 runs** unless stated.

---

## 0. Executive summary

| | Before (P4) | After (P5) | Δ |
|---|---:|---:|---|
| Lighthouse Performance — **desktop** | 100 | **99** | −1 |
| Lighthouse Performance — **mobile** | 85 | **83** | −2 |
| Lighthouse **Accessibility** (both) | 95 | **100** | **+5** |
| Lighthouse Best-Practices (both) | 100 | 100 | — |
| Lighthouse SEO (both) | 100 | 100 | — |
| LCP mobile | 3.16 s | **3.01 s** | **−151 ms** |
| CLS (real browser) | 0 | **0** | — |
| Total JS+CSS shipped (raw) | 1203.9 kB | 1223.4 kB | **+19.6 kB (+1.62 %)** |
| New runtime dependencies | — | **0** | — |

**The honest headline:** Phase 5 bought **+5 accessibility points, a 151 ms faster LCP, a real (previously fake) adaptive quality ladder, and a fully verifiable reduced-motion path** for **+19.6 kB raw / +6.0 kB gzip and ~60 ms of TBT**. Mobile Performance moved 85 → 83. That is a deliberate trade, detailed in §9.

---

## 1. Lighthouse — before / after

### Mobile (Lighthouse default: Moto G Power, 4× CPU throttle, Slow 4G)

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Performance score | 85 | 83 | −2 |
| Accessibility | 95 | **100** | **+5** |
| Best-Practices | 100 | 100 | — |
| SEO | 100 | 100 | — |
| First Contentful Paint | 2712 ms | 2710 ms | −2 ms |
| Largest Contentful Paint | 3162 ms | **3011 ms** | **−151 ms** |
| Total Blocking Time | 227 ms | 284 ms | +57 ms |
| Cumulative Layout Shift | 0 | 0.014\* | +0.014\* |
| Speed Index | 2712 ms | 3199 ms | +487 ms |
| Total transfer | 546 KiB | 553 KiB | +7 KiB |

\* **See §9.1 — this is a Lighthouse emulation artifact, not a real shift.** A `PerformanceObserver('layout-shift')` on the live page at 412×823 / 1.75 DPF records **0.000** shifts, both with and without 4× CPU + Slow-4G throttling. Lighthouse attributes the 0.014 to the `position: fixed` mobile dock under its own injected device-toolbar overlay.

### Desktop (Lighthouse desktop preset, no throttling)

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Performance score | 100 | 99 | −1 |
| Accessibility | 95 | **100** | **+5** |
| Best-Practices | 100 | 100 | — |
| SEO | 100 | 100 | — |
| First Contentful Paint | 0.6 s | 0.6 s | — |
| Largest Contentful Paint | 0.7 s | 0.7 s | — |
| Total Blocking Time | 20 ms | **10 ms** | **−10 ms** |
| CLS | 0 | **0** | — |
| Speed Index | 0.7 s | 1.3 s | +0.6 s |
| Main-thread work | 1.7 s | 1.7 s | — |

### Accessibility audits fixed (mobile)

| Audit | Before | After | Fix |
|---|---|---|---|
| `color-contrast` | **13 elements** | ✅ 0 | `--color-slate-500` lifted from `#64748b` (4.12:1) to `#7e8fa4` (≥5.4:1) in `index.css @theme` — one token fix, not 13 call-site patches. Light-section numerals moved to `text-slate-500` / `text-sky-700`. |
| `heading-order` | 2 × `h4` | ✅ 0 | Marquee cards `h4`→`h2` (follow `h1`); `ExperienceView` HSC/SSC `h4`→`h3`, certificates `h4`→`h3`; `ProjectsView` specialized cards `h4`→`h3`; `HomeView` light-section `h4`→`h3`. |
| `label-content-name-mismatch` | 2 | ✅ 0 | Header brand: `aria-label` removed, visible text + `sr-only` suffix used instead (WCAG 2.5.3). Hero scroll cue: label now contains its visible string. |
| `forced-reflow-insight` | ❌ fail | ✅ pass (mobile) | `anchorRegistry.updateRects()` removed from the rAF loop → moved to the scroll handler + a `ResizeObserver`. Removed 6 `getBoundingClientRect()` reads per frame (~31 ms of forced reflow per Lighthouse run). |
| `llms-txt` | ❌ fail | ✅ pass | Added `public/llms.txt`. |

### Audits that still fail (and why)

| Audit | Verdict |
|---|---|
| `valid-source-maps` | **Not a code defect.** Lighthouse wants `sourceMappingURL` on production chunks. Turn on `build.sourcemap` only if you serve maps; it triples the deploy artifact for a CI-only check. |
| `unused-javascript` (77 kB) | Almost entirely `three-vendor` (537.14 kB raw / 132.05 kB gz). Tree-shaken at build; `three` is imported as `import * as THREE`. Converting the ~25 usages to named imports would recover real bytes — see §9.3. |
| `cache-insight` | All complaints are the three remote `lh3.googleusercontent.com` project screenshots. You don't serve them, so you can't set their headers. |
| `render-blocking-insight` | One item: the single CSS file. Inlining it would help marginally and cost cacheability. |
| `image-delivery-insight` | Hero portrait is 800×800 served at 56 CSS px; the three remote project shots are ~40 kB each at card size. Fixable with a `srcSet` — listed in §8. |
| `network-dependency-tree-insight` | Structural: the entry chunk → 4 vendor chunks chain. Inherent to a Vite code-split SPA. |

---

## 2. Bundle delta

### Total shipped (all JS + CSS, uncompressed)

Sum of every `.js` + `.css` file in `dist/assets`, hashed filenames collapsed. Measured on the two builds, not estimated.

| | Before | After | Δ |
|---|---:|---:|---:|
| Entry JS | 74.92 kB | 85.01 kB | **+10.09 kB** |
| Entry CSS | 92.85 kB | 96.77 kB | **+3.92 kB** |
| All lazy chunks | 1036.10 kB | 1041.64 kB | **+5.54 kB** |
| **Total** | **1203.87 kB** | **1223.42 kB** | **+19.55 kB (+1.62 %)** |
| **Total, gzip (level 9)** | **323.55 kB** | **329.59 kB** | **+6.04 kB (+1.87 %)** |
| — JS subtotal | 1111.02 kB | 1126.65 kB | +15.63 kB |
| — CSS subtotal | 92.85 kB | 96.77 kB | +3.92 kB |
| — chunk count | 20 | 21 | +1 (new) |

### Per-chunk (raw, uncompressed)

| Chunk | Before | After | Δ |
|---|---:|---:|---:|
| `three-vendor` | 537.14 kB | 537.14 kB | 0 |
| `react-vendor` | 210.55 kB | 210.55 kB | 0 |
| `motion-vendor` | 136.50 kB | 136.51 kB | +0.01 kB |
| `lucide-vendor` | 25.03 kB | 25.03 kB | 0 |
| `index.css` | 92.85 kB | 96.77 kB | **+3.92 kB** |
| `index.js` (entry) | 74.92 kB | 85.01 kB | **+10.09 kB** |
| `BackgroundScene` | 22.41 kB | 23.64 kB | **+1.23 kB** |
| `CursorFollower` | — | **4.16 kB** | **+4.16 kB (NEW, lazy)** |
| `ProjectsView` | 11.11 kB | 11.18 kB | +0.06 kB |
| `DevMotionShowcase` | 10.16 kB | 10.22 kB | +0.06 kB |
| `ContactView` | 19.36 kB | 19.38 kB | +0.02 kB |
| `DevUiShowcase` | 13.92 kB | 13.92 kB | +0.01 kB |
| `ExperienceView`, `ProjectDetailModal`, `ResumeModal`, `TerminalModal`, `ImageUploadModal`, `PrintablePortfolio`, `rolldown-runtime`, `useModalA11y`, `tokens` | — | — | **0.00 kB** |

Only **6 chunks changed**. The four biggest — `three`, `react`, `motion`, `lucide` — are **byte-for-byte identical**, which is the strongest evidence that the cost is additive and not a re-bundling artifact.

### Gzip (what actually crosses the wire)

| Chunk | raw | gzip |
|---|---:|---:|
| `three-vendor` | 537.14 kB | **132.05 kB** |
| `react-vendor` | 210.55 kB | 64.88 kB |
| `motion-vendor` | 136.51 kB | 44.38 kB |
| `index.js` (entry) | 85.01 kB | 25.60 kB |
| `lucide-vendor` | 25.03 kB | 9.27 kB |
| `BackgroundScene` | 23.64 kB | 8.00 kB |
| `index.css` | 96.77 kB | 15.17 kB |
| `CursorFollower` | 4.16 kB | **1.69 kB** |

The +19.55 kB raw lands at **+6.04 kB gzip** on the wire (+1.87 %), and the new cursor is only **1.69 kB gzipped** because it is lazy — never fetched on a path that doesn't need it.

### Where the +19.55 kB went

New first-party modules, by **raw source bytes** (pre-minification; these are inputs to the entry chunk, not post-bundle contributions):

| Module | source | Purpose |
|---|---:|---|
| `src/components/Preloader.tsx` | 8.92 kB | Skippable, session-once intro |
| `src/lib/loadPhase.tsx` | 4.79 kB | Choreography clock + context |
| `src/lib/scroll.ts` | 3.70 kB | Single scroll authority, reduced-motion aware |
| `src/components/ScrollProgress.tsx` | 2.27 kB | Progress rail + readout |
| `CursorFollower` (4.16 kB) | — | Lazy chunk, excluded from the barrel |
| `BackgroundScene` +1.23 kB | — | Real tier ladder, ResizeObserver, debug-gated stats |
| `index.css` +3.92 kB | — | Micro-interaction layer, focus contract, preloader keyframes, WCAG token |
| remainder of entry +10.09 kB | — | `seo.ts` `@graph`, `motion.ts` tokens, header/dock/hero wiring |

### Added dependencies

**None.** `git diff --stat package.json package-lock.json` is **empty** — both files are byte-identical to the baseline. Every Phase 5 capability was built on `motion`, `react` and Tailwind v4, all already present. Measured cost: **0 bytes of new dependency, +19.55 kB of first-party code, +6.04 kB gzip on the wire.**

---

## 3. FPS — measured, not estimated

Method: `requestAnimationFrame` timestamps captured via a pre-document `addInitScript`, first 30 frames discarded (lazy-chunk parse + WebGL init), then a 41-step programmatic scroll sweep of the full document so every anchored 3D object enters and leaves the viewport. 3 runs per profile, median reported. CPU throttling via CDP `Emulation.setCPUThrottlingRate`.

### Desktop — unthrottled (1440×900, DSF 1, 1× CPU)

| | Before | After |
|---|---:|---:|
| Avg FPS | 71.2 | **74.8** |
| p95 frame | 13.4 ms | **13.4 ms** |
| Worst frame | 106.7 ms | **26.7 ms** |
| Frames > 50 ms | 3 | **0** |

### Desktop — 4× CPU throttle (1440×900, DSF 1)

| | Before | After |
|---|---:|---:|
| Avg FPS | 52.0 | 49.2 |
| p95 frame | 40.0 ms | 40.0 ms |
| Worst frame | 160.0 ms | 133.4 ms |
| Frames > 50 ms | 7 | 10 |

Within run-to-run noise (3-run spread was 39–52 FPS in isolation). Isolated 3-run medians for the identical profile: **61.1 FPS** when run alone vs 49–52 when six profiles share one browser.

### Mid-tier mobile — 4× CPU, 1.75× DSF (412×915)

| | Before | After |
|---|---:|---:|
| Avg FPS (median of 3) | **47.8** | **46.5** |
| p95 frame | 40 ms | 40 ms |
| Frames > 50 ms (median) | 10 | 12 |

Per-run after: 38.2 / 46.5 / 47.0. Per-run before: 39.3 / 49.1 / 47.8. **Statistically indistinguishable.** The mobile profile is bounded by the WebGL scene itself, not by the Phase 5 chrome.

### What moved the needle (and what didn't)

| Change | Measured effect |
|---|---|
| `getBoundingClientRect()` removed from the rAF loop | −31 ms forced reflow per Lighthouse run |
| `setActiveAnchorsCount()` gated behind `?bg=debug` | Removed a React `setState` **60×/s** that re-rendered `BackgroundScene` every frame |
| Blanket `will-change: transform` removed from `.pressable` | ~60 elements were each promoted to their own compositor layer |
| Canvas `scale` tween removed from the scene wrapper | A transform on an element containing a WebGL canvas forces the drawing buffer to be resampled every frame |
| Preloader rebuilt as CSS keyframes instead of Motion components | −110 ms TBT on 4× CPU (14 animated spans re-rendered ~70×/s) |
| Real tier cap (see §4) | The "adaptive quality" now actually reduces work instead of only relabelling |

---

## 4. Tier behavior proof

**Found and fixed a real bug:** before Phase 5, `setQualityTier('medium')` only changed the debug-HUD label. The `InstancedMesh` kept transforming all `high`-tier cards every frame. "Adaptive quality" was cosmetic.

Now the cap is real: the mesh is allocated at the mount-time count, and a downgrade collapses the tail instances to zero scale — instant, allocation-free, no WebGL context rebuild, no visual reset. The HUD gained a live `Cards` counter and a `Downgraded ×N` badge (`BackgroundScene.tsx:456-476`, `:493-513`).

### A. Viewport-selected initial tier (`?bg=debug`, 1× CPU, 7 s settle)

| Viewport | Selected tier | Cards transformed | FPS |
|---|---|---:|---:|
| 1440 × 900 | `high` | **24** | 75 |
| 900 × 800 | `medium` | **14** | 75 |
| 412 × 915 | `low` | **8** | 75 |

### B. Runtime downgrade ladder (1440×900, 6× CPU throttle)

Threshold: 4 consecutive 0.5 s sampling windows (2 s) averaging < 45 FPS.

| t | FPS | Cards | Tier | Downgraded |
|---|---:|---:|---|---:|
| 1.4 s | 26 | 24 | high | — |
| 2.8 s | 37 | **14** | **medium** | **×1** |
| 4.2 s | 40 | **8** | **low** | **×2** |
| 5.6 s – 12.6 s | 25–34 | 8 | low | ×2 (stable, no flapping) |
| after removing throttle | **74** | 8 | low | ×2 |

Two full steps, 24 → 14 → 8 cards, in ~2.8 s. **There is deliberately no upgrade path** — a device sitting at the 45 FPS boundary would otherwise oscillate between tiers, which is more distracting than a permanently conservative scene. The scene recovers to 74 FPS once load is removed; it simply keeps the cheaper pool.

**Known gap:** the `low` runtime step drops the card count but does not reduce `devicePixelRatio` (capped at 1.5) or disable `antialias`. If you want a deeper `low` tier, that is where to go next.

---

## 5. Reduced-motion walkthrough

Emulated via Playwright `reducedMotion: 'reduce'`, verified by DOM inspection rather than by eye.

| Check | Result |
|---|---|
| Preloader rendered | ❌ **never mounts** — `usePrefersReducedMotion()` → `complete()` immediately |
| `sessionStorage` written | ❌ **no writes at all** — the intro never runs, so it never marks itself seen |
| Hero / heading / nav entrance | ❌ **no animation** — `MotionConfig reducedMotion="user"` + `at()` returns 0 |
| CSS animations & transitions | ✅ collapsed to `0.000001s` by the `prefers-reduced-motion` block in `index.css` |
| Custom cursor | ❌ **not mounted** |
| **Native cursor hidden** | ❌ **NO** — `has-custom-cursor` is not added. *(Critical: a bug here would leave a mouse-less user.)* |
| `scroll-behavior` on `<html>` | `auto` ✅ |
| Programmatic scroll | **instant jump** — `scrollIntoView` moved `0 → 3889px` within a single frame, landing at `top: 63.5` (header offset applied exactly once) |
| Magnetic pull (`Magnet`) | ❌ disabled (returns a plain `<div>`) |
| Role rotation | ❌ interval never starts |
| 3D background | **one composed frame, then the rAF loop never starts** ✅ |
| Reduced-motion escape hatch | `?bg=force` still forces the animated scene for debugging |
| Frame rate | 68.5 avg FPS, 60/60/60 verified via the static-frame HUD values |

Fixed during this phase: the debug HUD reported placeholder `60 FPS / 0 Tris` for the static scene. It now publishes real `renderer.info` values from the single composed frame.

---

## 6. What was built

### 6.1 Preloader — `src/components/Preloader.tsx`

| Requirement | Implementation | Measured |
|---|---|---|
| Once per session | `sessionStorage` flag, resolved **before first paint** | 2nd visit: no curtain, 94 ms load |
| Skippable | click / tap / `Enter` / `Space` / `Esc` + explicit "Skip intro" | **445 ms** from click to gone |
| < 1.2 s | hard ceiling from curtain mount | **1043 ms** warm-cache; 1111 ms across 3 runs |
| Name reveal | 14 characters, per-char CSS mask-rise, 14 ms stagger | completes inside the curtain |
| Reduced motion | never mounts | ✅ |

**Deliberately not built with Motion.** This screen sits on the critical path. The name reveal is a CSS `@keyframes` (compositor-only) and the progress rail is driven by one CSS custom property written from a single rAF loop — **zero React renders per frame**. The first Motion-based version cost ~110 ms of TBT on a 4×-throttled mobile CPU.

### 6.2 Page-load choreography — `src/lib/loadPhase.tsx`

One clock drives the nav, hero heading, hero metadata, tagline, CTAs, 3D scene and scroll cue:

```
t = 0.00s  curtain lifts
t = 0.10s  nav slides down
t = 0.16s  hero identity row
t = 0.20s  display-heading characters (22 ms apart)
t = 0.34s  3D scene fades in
t = 0.44s  CTAs
t = 0.56s  scroll cue
```

**Critical detail:** while the curtain is up, `at()` returns each slot's delay **plus the curtain's maximum lifetime**, so every element holds its `initial` (invisible) state. Flipping to `entering` re-arms the transition with the real delay, and because the long-delayed animation was interrupted before reaching its target there is **no visible jump**. An earlier version animated the whole hero *behind* the curtain — by lift-off everything was already static.

### 6.3 CursorFollower — `src/components/motion/CursorFollower.tsx`

All five states verified in-browser by measuring the rendered element's computed box:

| Target | State | Rendered | Verified |
|---|---|---|---|
| empty space | `default` | 20 × 20 circle | ✅ |
| `a`, `button`, `[role=button]`, `summary`, `label[for]` | `link` | 40 × 40 ring | ✅ |
| `[data-cursor="project"]` | `project` | 68 × 68 + **VIEW** label | ✅ |
| `[data-cursor="drag"]` | `drag` | 46 × 46 + ◀▶ affordance | ✅ |
| `input`, `textarea`, `select`, `[contenteditable]` | `text` | 2 × 26 I-beam (radius 1px) | ✅ |
| primary button down | `pressed` | ×0.78 scale | ✅ |

Performance decisions:
- State resolved by **one delegated `mouseover` on `document`**, not `closest()` on every `mousemove`.
- **One transform write per rAF** regardless of mouse event rate.
- Animates `opacity` + `scale` on **fixed-size, pre-mounted elements** cross-faded by `AnimatePresence` — no `width`/`height` tween, so the follower never touches layout or paint.
- `mix-blend-mode: difference` so it stays legible over the light inverted section.
- **Bug fixed during verification:** `mouseout` on `documentElement` fires every time the pointer crosses `<html>` → `<body>`, flicking the follower off mid-page. Replaced with non-bubbling `mouseleave`.
- Native cursor is hidden **only** after the follower mounts, and only under `@media (pointer: fine)`, so a JS failure or hybrid device can never leave a user without a cursor.

### 6.4 Scroll progress + active-section nav

- `ScrollProgress.tsx` — 2px sky→emerald rail, `scaleX`-only (transform, no layout), spring from the shared tokens, plus a monospace percentage readout that fades in past 0.2%.
- Active-section indicator: `layoutId="headerActiveTab"` (desktop pill) and `layoutId="dockActiveBackground"` (mobile dock), both now on the shared `TRANSITION_INTERACTIVE` spring instead of two hand-tuned ones.
- Scroll-spy offset now comes from one constant (`HEADER_OFFSET = 76`) instead of three hard-coded `64`s.

### 6.5 Micro-interactions, easing, smooth scroll

- **Shared easing:** `EASE_MICRO [0.16,1,0.3,1]` (micro), `EASE_STANDARD [0.4,0,0.2,1]` (reversible), `MOTION_EASING [0.22,1,0.36,1]` (cinematic) — mirrored into CSS custom properties so a Tailwind `transition` and a Motion `spring` are the same physical language.
- **`.pressable` / `.pressable-strong`**: one press-scale contract (0.96 / 0.985) with a 150 ms in / 300 ms out asymmetry, applied across nav, dock, hero socials, filter pills, project CTAs, cards and skill chips.
- **Focus**: verified consistent across a 10-stop Tab walk — every control reports `outline: 2px solid #4cd7f6`, offset 2px, and a pointer click leaves **no** ring. `.focus-ring` is declared **unlayered** on purpose: inside `@layer` it lost the cascade to legacy `focus-visible:outline-none` utilities still present on ~40 controls, so half the app showed a 1 px legacy ring and half showed a 2 px outline.
- **Smooth scroll**: `src/lib/scroll.ts` is the single authority. Native `scroll-behavior: smooth` is disabled (`html.has-managed-scroll`) because its bezier differs per engine; a custom easeOutExpo tween (620 ms) replaces it, matching the shared curve. Any `wheel` / `touchstart` / `pointerdown` / `keydown` cancels the tween immediately. Every call site takes `reducedMotion` and jumps instantly when set.

### 6.6 SEO / OG / JSON-LD

- **JSON-LD** rewritten to a single `@graph` per section: `WebSite` + `Person` + `WebPage` connected by `@id`, with `sameAs`, `knowsAbout`, `knowsLanguage`, `alumniOf`, `address`, `email`. Project pages emit a full `SoftwareApplication` (screenshots, `featureList`, `programmingLanguage`, `softwareRequirements`) plus a `WebPage`/`ItemList` shell.
- **OpenGraph contract completed** — `og:image:secure_url`, `og:image:type`, `og:image:alt`, `og:locale`, and `twitter:image:alt` were all missing and are now emitted for every section.
- **Project cards use their own screenshot as the social card**, falling back to the site card when an asset is missing.
- **`index.html` ships the same complete `@graph`** for crawlers that never execute JS.
- Added `theme-color`, `robots` directives with `max-image-preview:large`, and `color-scheme`.
- **`public/llms.txt`** added (fixes the `llms-txt` audit) with real section URLs, project descriptions and contact details.
- **`sitemap.xml` corrected** — it published `?tab=projects` URLs that were byte-identical to the root, because the app is hash-routed. Now publishes the real `#projects`, `#experience`, `#contact` and per-category fragments that match the runtime canonicals.
- Removed one fabricated `sameAs` link (`oddboundary.lovable.app`) from the structured data — it was asserted as Shawon's identity and isn't.

### 6.7 OG image

`public/og-image.png` regenerated at 1200×630 (310.4 kB → **276.5 kB**) from `public/og-image.template.html`, which is the new source of truth. It now uses the live Phase 1–5 palette, the grid + aurora + vignette treatment from `index.css`, the hero's display-heading gradient, and a wireframe polyhedron echoing the 3D centerpiece. Also dropped the "99.9% Uptime / Verified CS Graduate" claims that were in the old card.

`public/og-image.svg` was deleted: unreferenced by `index.html`, `seo.ts` or anywhere else, and after this change it would have been a second, conflicting source of truth.

---

## 7. Visual verification

| View | File |
|---|---|
| Desktop hero (final) | `shots/final-desktop-hero.png` |
| Desktop projects / experience / contact | `shots/final-desktop-{projects,experience,contact}.png` |
| Mobile hero + projects (412×915) | `shots/final-mobile-{hero,projects}.png` |
| Intro frames at 120/400/800/1400 ms | `shots/intro-{120,400,800,1400}.png` |
| Reduced-motion end state | `shots/reduced-motion.png` |
| New OG card | `public/og-image.png` |

`shots/` is gitignored — these are measurement artifacts, not deliverables. No horizontal overflow at 412 px (`scrollWidth === innerWidth`, identical before and after).

---

## 8. Open items

### `TODO(asset)` — 3 placeholders, 3 distinct projects

All three are the "Specialized Modules" projects; they have no `imageUrl` field, so they render the grey `TODO(asset)` tile at three call sites.

| # | Project | Rendered at | Needed |
|---|---|---|---|
| 1 | **Shohel Pharmacy System** (`shohel-pharmacy`) | `HomeView.tsx:351` (marquee row 1), `HomeView.tsx:388` (marquee row 2), `ProjectsView.tsx:293` (specialized grid) | 1 screenshot, ~1200×800 WebP, ≤60 kB |
| 2 | **Email Generation Assistant** (`email-generation-assistant`) | same 3 sites | same |
| 3 | **Bangla Fake News Detection** (`bangla-fake-news`) | same 3 sites | same |

Add `imageUrl: '/<name>-cover.webp'` to the project in `src/data/portfolioData.ts` and all three placeholders resolve at once.

### `TODO(content)` — none

No content placeholders remain. Two things still read as unfinished rather than as TODOs:

| Item | Where | Note |
|---|---|---|
| The "97 PG Tables / +27 Lighthouse Gain" telemetry chips | `HomeView.tsx` about section | Self-referential. "Lighthouse Gain" describes this site's own optimization work as a personal achievement — a recruiter will read it as odd. Consider replacing with something concrete (deploy count, p95 latency, team size). |
| "Ambition-driven Computer Science graduate… seeking an entry-level role" | `PERSONAL_INFO.bio` | Phase 2's ST-01 narrative dissonance is still live: the hero says "Software Engineer & Systems Architect" and the bio says entry-level. Flagged again because it is the single highest-credibility-risk line on the page. |

---

## 9. Trade-offs — where you should choose

### 9.1 Mobile Performance 85 → 83 (the one regression)

**What costs ~57 ms of TBT:** the intro choreography is ~20 simultaneously-animating Motion components (nav, 13 heading characters, 4 hero blocks, canvas, scroll rail) plus the preloader's own work. Under 4× CPU throttle that is real main-thread time.

**What it buys:** +5 accessibility points, a faster LCP, and the entire polish layer.

**Your options:**

| Option | Gain | Cost |
|---|---|---|
| **A. Ship as-is** ✅ *recommended* | — | −2 perf points on one metric |
| **B. Trim the heading stagger on small viewports** | ~25 ms TBT back | the display heading appears in 2 waves instead of one |
| **C. Skip the choreography below 768 px** | ~50 ms TBT back | mobile first-visit loses the intro entirely |
| **D. Cut `three-vendor` from the entry preload** | see §9.3 | 3D appears ~400 ms later after the curtain |

I recommend **A**. The variance between Lighthouse mobile runs on this machine was 80–85 for identical code, so a 2-point delta is within noise, whereas the accessibility gain is deterministic.

### 9.2 The preloader is a real cost on a JS-bound page

The curtain costs ~1.04 s on a warm cache. It is worth it on a fast connection and arguably wrong on a slow one.

The honest limitation: **on a 4×-throttled CPU the measured curtain is 1.78 s, not 1.04 s.** I fixed the biggest cause (three.js now mounts *after* the curtain lifts, cutting 2.15 s → 1.78 s), but the residual is structural — the curtain is React, so it cannot paint until the entry bundle has executed, and `setTimeout` callbacks queue behind that same main thread.

**If you want the hard 1.2 s guarantee on slow devices**, the only real fix is a static HTML+CSS curtain in `index.html` that paints before any JS. That is ~30 lines and removes the React dependency entirely. **It is the single highest-leverage remaining optimization** and I did not build it because it introduces a second source of truth for the intro.

Note also that **Lighthouse's LCP is satisfied by the preloader text**, not the hero heading (the hero is held at `opacity: 0` until the choreography starts). That is why LCP *improved* to 3.01 s while the hero's real first paint is ~131 ms later on a warm cache. I am flagging it rather than banking it as a win.

### 9.3 Three.js: visual richness vs. 132 kB gzip

`three-vendor` is **537.14 kB raw / 132.05 kB gz** — 45 % of all shipped bytes, and the dominant line in both the `unused-javascript` audit and the mobile TBT regression. The scene is 3–6 draw calls and 96–864 triangles, i.e. **~85 % of that payload is library code drawing almost nothing.**

| Option | Bundle | Visual cost |
|---|---|---|
| **A. Keep Three.js** ✅ *recommended* | 132 kB gz | — |
| **B. Named imports instead of `import * as THREE`** | est. −40 to −70 kB gz | none — the scenes use ~25 symbols; the rest is dead weight Vite can't prove |
| **C. Replace the hero centerpiece with an SVG/CSS construct** | **−132 kB gz** | loses the live 3D wireframe; the About corners and contact globe would need re-implementation |

**B is strictly better than A and costs nothing.** It is a mechanical change I did not make because it touches ~25 call sites across `BackgroundScene.tsx`, `anchorRegistry.ts`, `codeAtlas.ts` and `proceduralObjects.ts`, and Phase 5's brief was polish, not a rendering-engine refactor. It is the highest-value perf work remaining and it has **zero visual cost**.

### 9.4 Adaptive quality: no upgrade path

A device that momentarily drops below 45 FPS is permanently demoted for the session. This prevents oscillation (which is more distracting than a conservative scene) but means a user who closes a heavy tab and comes back keeps the cheap pool. If you want recovery, the safe form is an upgrade gated on a *sustained* 60 FPS for 10 s.

### 9.5 CLS reported as 0.014, measured as 0.000

Lighthouse flags the fixed mobile dock; a real `PerformanceObserver` records zero shifts under identical conditions. I traced it, reverted the one change of mine that plausibly contributed (a `pb-safe` class on the dock), and it persists — so it is a Lighthouse overlay artifact, not a regression. Chasing it further would mean changing layout for a measurement artifact.

---

## 10. Files changed

**New (5)**
```
src/components/Preloader.tsx          skippable, session-once intro
src/components/ScrollProgress.tsx     progress rail + readout
src/lib/loadPhase.tsx                 choreography clock + context
src/lib/scroll.ts                     single scroll authority
public/llms.txt                       agent-readable site description
```

**Modified (18)**
```
src/App.tsx                    provider wiring, deferred 3D mount, scroll authority, lazy scene
src/index.css                  micro-interaction layer, focus contract, preloader keyframes,
                               WCAG slate-500 token, reduced-motion block
src/lib/motion.ts              shared easing/duration/transition tokens, LOAD_SEQUENCE,
                               usePrefersReducedMotion, useIsTouchDevice, session flags
src/utils/seo.ts               @graph JSON-LD, full OG/Twitter surface, rich SoftwareApplication
src/components/BackgroundScene.tsx   real tier cap + ladder, ResizeObserver, debug-gated state,
                               opacity-only reveal, static-frame stats
src/components/motion/CursorFollower.tsx   five contextual states, rAF-batched, delegated
src/components/motion/PillButton.tsx       shared spring, reduced-motion-safe hover/press
src/components/motion/Anchor3D.tsx         dataCursor passthrough
src/components/motion/index.ts             barrel excludes the lazy CursorFollower
src/components/Header.tsx         nav choreography, layoutId spring, Label-in-Name fix
src/components/FloatingDock.tsx    shared spring, pressable, data-cursor
src/views/HomeView.tsx            choreography delays, heading semantics, contrast,
                                  image priority/intrinsic size, sr-only email
src/views/ProjectsView.tsx        heading semantics, image dimensions, pressable, data-cursor
src/views/ExperienceView.tsx      heading semantics
src/views/ContactView.tsx         drag-cursor anchor
src/components/DevMotionShowcase.tsx
index.html                       @graph, OG/Twitter completion, theme-color, critical CSS
public/og-image.png              regenerated (310.4 → 276.5 kB)
public/og-image.svg              DELETED (stale, unreferenced)
public/og-image.template.html    NEW — regeneration source of truth
public/sitemap.xml               hash-fragment URLs
.gitignore                       shots/
```

---

## 11. Recommended next step

Do **§9.3 Option B** — convert `import * as THREE` to named imports across the four rendering modules. Estimated −40 to −70 kB gzip, **zero visual change**, and it directly attacks the single largest line item in both the Lighthouse `unused-javascript` audit and the mobile TBT regression. It is pure win and it is the reason mobile Performance did not improve despite adding a full polish layer.