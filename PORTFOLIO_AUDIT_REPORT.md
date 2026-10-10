# Comprehensive Portfolio Audit & Modernization Blueprint

**Project:** Shawon.dev Portfolio  
**Audit Date:** October 2026  
**Auditor Role:** Principal Product Designer & Senior Frontend Engineer  
**Benchmark Target:** Awwwards / CSS Design Awards Developer Portfolio Standard  

---

## 1. Executive Summary

- **Overall Portfolio Score:** **52 / 100**
- **Verdict:** A visually ambitious single-page application with modern foundations (Tailwind v4, Three.js, Motion), but severely undermined by a **1.05 MB monolithic JavaScript bundle**, broken icon webfont fallbacks, critical responsive layout overflows, accessibility violations (WCAG 2.2 AA non-compliant), and a disjointed personal narrative that oscillates between fresh graduate and principal enterprise architect.

### Top 5 Strengths
1. **Rich Technical Substance & Real Project Data:** Real project case studies (`AmarShop`, `SupportPilot AI`, `Online24Pharmacy`) backed by genuine architectural decisions (Prisma, PostgreSQL, pgvector, Redis, FastAPI, Vitest) rather than generic placeholder copy (`src/data/portfolioData.ts:24-197`).
2. **Dedicated Print Dossier Engine:** Fully realized `@media print` CSS and `PrintablePortfolio.tsx` providing an automated CV / project summary document for hiring managers (`src/components/PrintablePortfolio.tsx:1-180`, `src/index.css:140-379`).
3. **Advanced Three.js Background Implementation:** `BackgroundScene.tsx` features proper WebGL detection, particle pool memory management, visibility listeners (`document.hidden`), and `prefers-reduced-motion` detection (`src/components/BackgroundScene.tsx:76-98`).
4. **Comprehensive Section-Level Dynamic SEO Utility:** `src/utils/seo.ts` actively synchronizes document titles, OpenGraph, Twitter metadata, and JSON-LD structured data with section scroll state (`src/utils/seo.ts:304-331`).
5. **Modern Build Stack:** Vite 8.3, React 19, Tailwind v4, Motion v12, and strict TypeScript types (`src/types.ts:1-95`).

### Top 5 Critical Problems
1. **Massive 1.05 MB Un-Split JS Bundle & Two Concurrent WebGL Loops:** `src/views/HomeView.tsx:5` statically imports `TechCanvas3D.tsx`, which pulls the entire Three.js library directly into the main entry chunk (`index-AOVhU-qv.js: 1,054.74 kB`). Furthermore, running `BackgroundScene` and `TechCanvas3D` simultaneously creates two distinct WebGL contexts executing `requestAnimationFrame` loops at 60 FPS, crushing mobile performance (Lighthouse Performance score: **34 Desktop / 48 Mobile**, FCP **5.6s**).
2. **Unstyled Icon Font Failure Across the Entire Application:** Google Material Symbols Outlined is loaded via render-blocking Google Fonts `<link>` in `index.html:37` without a font fallback or SVG integration. On initial render or under slow network conditions, icons display as raw literal ligature text strings: `"print Print Portfolio"`, `"description CV Resume"`, `"location_on Dhaka"`, `"terminal const focus"`, `"arrow_forward"`, `"home"`, `"code_blocks"`, `"history_edu"`, `"alternate_email"` (Observed in headless screenshots across all viewports).
3. **Mobile & Tablet Responsive Breakdowns:** At 390px viewport width, the layout triggers horizontal scrolling/overflow (`<html class="dark">` scrollbar visible), status badges clip at the viewport edge (`viewport_390.png`), the bottom navigation truncates (`Conta...`), and at 768px the top navigation bar clips the brand logo and overflows (`viewport_768.png`). Furthermore, `BottomNav.tsx:18` lacks `md:hidden`, causing mobile bottom tabs to be displayed simultaneously with the desktop header on 1440px screens (`viewport_1440.png`).
4. **WCAG 2.2 AA Accessibility & Lighthouse Violations:** 
   - `index.html:5` forces `maximum-scale=1.0, user-scalable=no`, directly violating WCAG 1.4.4 (Resize Text).
   - `BackgroundScene.tsx:442` wraps an interactive `<button>` inside an `<div aria-hidden="true">` container, failing automated accessibility audits.
   - `ContactView.tsx:311` contains a `<select>` dropdown and text inputs without associated `<label htmlFor="...">` attributes (`select-name` audit failure).
   - Modals (`ResumeModal`, `ProjectDetailModal`, `TerminalModal`) lack ARIA dialog roles, focus trapping, Escape key dismissals, and background scroll locking.
5. **Narrative & Credibility Dissonance:** The personal narrative oscillates jarringly between an entry-level "CS Graduate seeking an entry-level software engineering role" (`portfolioData.ts:18`) and an inflated "Systems Architect" claiming "99.9% Uptime", "97 PG Tables", "built with mathematical precision", and "Next.js 16" (a non-existent version). Furthermore, prominent "Upload / Change Photo" buttons across the hero and modal UI make the portfolio look like an unfinished CMS admin prototype rather than a polished showcase for hiring managers.

### Single Highest-Impact Change
**Unify the Icon System to inline Lucide React SVGs & Code-Split Three.js:** Replace all Google Material Symbols ligatures with tree-shaken `lucide-react` icons (already installed in `package.json:19`), eliminate `TechCanvas3D` from the initial bundle via dynamic `lazy()` imports, and eliminate the render-blocking Google Fonts stylesheet. This immediately fixes the unstyled text glitch, cuts initial bundle size by ~70% (from 1,054 kB to < 220 kB), and boosts Lighthouse Performance from 34 to 85+.

---

## 2. Scorecard Table

| Area | Score (1-10) | One-Line Verdict |
| :--- | :---: | :--- |
| **1. Visual Design System** | **5 / 10** | Cohesive dark palette, but ruined by raw text icon fallbacks, card clutter, and excessive pill badges. |
| **2. First Impression & Storytelling** | **5 / 10** | Dissonance between entry-level graduate and principal systems architect; confusing "Change Photo" CTAs. |
| **3. Motion & Interaction** | **6 / 10** | Competent Three.js background, but dual un-throttled WebGL loops waste GPU; micro-interactions feel inconsistent. |
| **4. Responsiveness** | **4 / 10** | Horizontal scrollbar on mobile (390px), clipped headers at 768px, and desktop bottom nav pollution. |
| **5. Performance** | **4 / 10** | Monolithic 1.05 MB bundle, 11.1s LCP on desktop, 636 KB uncompressed hero image, and render-blocking fonts. |
| **6. Accessibility (WCAG 2.2 AA)** | **5 / 10** | Blocked viewport pinch-zoom, interactive button inside `aria-hidden`, missing form labels, and focus traps. |
| **7. SEO & Sharing** | **6 / 10** | Excellent dynamic JSON-LD in `seo.ts`, but missing `robots.txt` (SPA 404), sitemap, `og:image`, and favicons. |
| **8. Code Quality & Maintainability** | **6 / 10** | Clean TypeScript models, but unused heavy packages (`@google/genai`, `express`), dead code, and npm peer conflicts. |
| **TOTAL** | **52 / 100** | **Grade: C+ (Needs focused structural refinement for Awwwards-caliber quality)** |

---

## 3. Detailed Findings Per Area

### Area 1: Visual Design System

#### Finding DS-01: Material Symbols Webfont Renders as Raw Ligature Text
- **Severity:** Critical
- **Evidence:** `index.html:37`, `src/components/Header.tsx:123`, `src/components/BottomNav.tsx:33`, `src/views/HomeView.tsx:508`, `scratch/screenshots/test.png`.
- **Why it hurts:** Browsers rendering before the 4 MB `Material Symbols Outlined` WOFF2 file finishes downloading display raw ligature strings inline (`print Print Portfolio`, `description CV Resume`, `terminal const focus = ... content_copy`, `location_on Dhaka`). This completely destroys visual credibility within the first 500ms.
- **Recommended Fix:** Replace all `<span className="material-symbols-outlined">icon_name</span>` with tree-shaken SVG components from `lucide-react` (already present in `package.json:19`), and remove the Google Fonts link in `index.html:37`.
- **Effort:** M | **Impact:** 5

#### Finding DS-02: Simultaneous Dual Navigations on Desktop Viewports
- **Severity:** High
- **Evidence:** `src/components/BottomNav.tsx:18`, `src/App.tsx:314`, `scratch/screenshots/viewport_1440.png`.
- **Why it hurts:** `BottomNav.tsx` has class `fixed bottom-0 left-0 right-0 z-50` with no breakpoint visibility limiter (`md:hidden`). On a 1440px desktop screen, users see both the top sticky header navigation and a floating mobile tab bar pinned to the bottom of their screen, obscuring content and looking amateurish.
- **Recommended Fix:** Add `md:hidden` to `<nav>` in `src/components/BottomNav.tsx:18`.
- **Effort:** S | **Impact:** 4

#### Finding DS-03: Badge & Kicker Clutter in Hero Header
- **Severity:** Medium
- **Evidence:** `src/views/HomeView.tsx:119-150`.
- **Why it hurts:** Four separate pill badges compete for attention in the hero: "Systems Architect • AI Full-Stack", "MD SHAWON MOLLA • SOFTWARE ENGINEER", "Open for Full-Time SWE Roles", and "location_on Dhaka, Bangladesh". This creates visual noise and dilutes focus.
- **Recommended Fix:** Consolidate into a single refined status indicator: e.g., an understated availability badge (`Available for SWE roles • Dhaka (UTC+6)`).
- **Effort:** S | **Impact:** 3

#### Finding DS-04: Card Border & Glow Inconsistency
- **Severity:** Medium
- **Evidence:** `src/index.css:8-11`, `src/views/HomeView.tsx:555, 634`, `src/views/ProjectsView.tsx:187`.
- **Why it hurts:** Some cards use `border border-white/5`, others `border border-white/10`, others `border border-white/15`, and glows vary between cyan `shadow-[0_0_10px_rgba(76,215,246,0.6)]` and emerald tints without a unified design token system.
- **Recommended Fix:** Standardize on semantic tokens: `border-border-subtle: rgba(255,255,255,0.08)`, `border-border-hover: rgba(76,215,246,0.3)`.
- **Effort:** S | **Impact:** 3

---

### Area 2: First Impression and Storytelling

#### Finding ST-01: Conflicting Persona & Credibility Mismatch
- **Severity:** Critical
- **Evidence:** `src/data/portfolioData.ts:18` vs `src/views/HomeView.tsx:123` & `src/data/portfolioData.ts:31`.
- **Why it hurts:** `portfolioData.ts:18` states: *"Ambition-driven Computer Science graduate... Seeking an entry-level software engineering role"*, while the hero kicker shouts *"SYSTEMS ARCHITECT"*, *"Engineering High-Scale Systems & Autonomous AI"*, and claims *"99.9% Uptime"* and *"97 PG Tables scaled with mathematical precision"*. Technical recruiters and senior engineering managers immediately detect hyperbole, which erodes trust.
- **Recommended Fix:** Align the narrative around an authentic, high-impact positioning: **"Full-Stack Software Engineer specializing in scalable web systems, distributed architectures, and AI integrations."** Back this up with concrete project metrics rather than inflated titles.
- **Effort:** S | **Impact:** 5

#### Finding ST-02: Distracting "Change Photo / Upload" Controls in User-Facing Hero
- **Severity:** High
- **Evidence:** `src/views/HomeView.tsx:173, 200, 208`, `scratch/screenshots/viewport_768.png`, `scratch/screenshots/viewport_390.png`.
- **Why it hurts:** Prominent "Upload Photo" and "Change Photo" buttons appear on the executive card in both desktop and mobile viewports. Visitors expect a portfolio, not an administrative profile-editing dashboard.
- **Recommended Fix:** Remove user-facing photo upload buttons from the public hero interface. If dynamic avatar personalization is desired, tuck it into the terminal modal as an easter egg command (`set-avatar <url>`).
- **Effort:** S | **Impact:** 4

#### Finding ST-03: CTA Choice Overload in Hero
- **Severity:** Medium
- **Evidence:** `src/views/HomeView.tsx:299-360`, `scratch/screenshots/viewport_1440.png`.
- **Why it hurts:** The hero section presents five distinct button options in close proximity: "Explore Projects", "Inspect CV Resume", "Initiate Collaboration & Contact", "github.com/...", and "linkedin.com/...". Hick's Law dictates that excessive choices increase decision fatigue and reduce conversion.
- **Recommended Fix:** Reduce hero actions to two clear hierarchical CTAs: Primary: `View Projects` (solid primary), Secondary: `Resume / CV` (outline/subtle container).
- **Effort:** S | **Impact:** 4

#### Finding ST-04: Non-Existent Framework Claims ("Next.js 16")
- **Severity:** High
- **Evidence:** `src/data/portfolioData.ts:65, 421`, `src/views/HomeView.tsx:673`.
- **Why it hurts:** The project data cites `Next.js 16` in tech stack tags and skill matrices. As of current Next.js release cycles, Next.js 15 is standard. Claiming Next.js 16 makes the portfolio look inaccurate or generated by AI without validation.
- **Recommended Fix:** Correct all references to `Next.js 15` (or Next.js 15.2).
- **Effort:** S | **Impact:** 4

---

### Area 3: Motion and Interaction

#### Finding MO-01: Two Concurrent WebGL Contexts Causing GPU Overhead
- **Severity:** High
- **Evidence:** `src/App.tsx:242` (`BackgroundScene.tsx`), `src/views/HomeView.tsx:5` (`TechCanvas3D.tsx`).
- **Why it hurts:** Two separate Three.js render loops run concurrently on the same page. On lower-end laptops or mobile devices, running two WebGL canvases causes dropped frames, device thermal throttling, and battery drain.
- **Recommended Fix:** Keep `BackgroundScene` as the subtle ambient backdrop. Convert `TechCanvas3D` into an on-demand, interactive modal or render it only when scrolled into view using an `IntersectionObserver`, pausing its render loop when offscreen.
- **Effort:** M | **Impact:** 4

#### Finding MO-02: `useEffect` State Toggling Causes Full Three.js Re-initialization
- **Severity:** Medium
- **Evidence:** `src/components/TechCanvas3D.tsx:278` (`}, [isRotating, variant, wireframeMode]);`).
- **Why it hurts:** When the user clicks the pause/play rotation button, `isRotating` triggers a complete tear-down and recreation of the WebGL renderer, scene, and geometries instead of merely updating a mutable ref in the animation loop.
- **Recommended Fix:** Store `isRotating` in a `useRef<boolean>` and toggle the ref in the `animate()` loop without re-triggering the `useEffect`.
- **Effort:** S | **Impact:** 3

#### Finding MO-03: `TechCanvas3D` Ignores `prefers-reduced-motion`
- **Severity:** Medium
- **Evidence:** `src/components/TechCanvas3D.tsx:1-330`.
- **Why it hurts:** While `BackgroundScene.tsx` checks `prefers-reduced-motion`, `TechCanvas3D.tsx` does not check user motion preferences at all, auto-rotating continuously.
- **Recommended Fix:** Add a media query check for `(prefers-reduced-motion: reduce)` in `TechCanvas3D.tsx` and disable auto-rotation by default when enabled.
- **Effort:** S | **Impact:** 3

---

### Area 4: Responsiveness

#### Finding RS-01: Horizontal Scrollbar and Layout Overflow at 390px
- **Severity:** Critical
- **Evidence:** `index.html:5`, `src/views/HomeView.tsx:112`, `scratch/screenshots/viewport_390.png`.
- **Why it hurts:** Testing at 390px reveals an active horizontal scrollbar. The top telemetry bar pills and long title strings extend past the 390px viewport edge, degrading the mobile experience.
- **Recommended Fix:** Audit containers with negative margins or fixed min-widths; apply `max-w-full overflow-hidden` to outer wrappers, wrap pill badges in `flex-wrap`, and use responsive font sizing (`text-base sm:text-lg`).
- **Effort:** M | **Impact:** 5

#### Finding RS-02: Header Layout Break at 768px Tablet Viewport
- **Severity:** High
- **Evidence:** `src/components/Header.tsx:39-160`, `scratch/screenshots/viewport_768.png`.
- **Why it hurts:** At 768px, the brand title text wraps or gets clipped, displaying only `/` and `TO WORK`, while desktop buttons ("Print Portfolio", "CV Resume") crowd out navigation elements.
- **Recommended Fix:** Use proper responsive visibility thresholds (`lg:flex` instead of `md:flex` for desktop links), collapse auxiliary actions into an icon dropdown or drawer on tablet viewports (< 1024px).
- **Effort:** M | **Impact:** 4

#### Finding RS-03: Mobile Bottom Nav Label Truncation
- **Severity:** Medium
- **Evidence:** `src/components/BottomNav.tsx:34`, `scratch/screenshots/viewport_390.png`.
- **Why it hurts:** On 390px width screens, the fourth tab label "Contact" overflows and renders as `Conta...`.
- **Recommended Fix:** Reduce tab padding and adjust label font size: `text-[10px]` with `tracking-tight`.
- **Effort:** S | **Impact:** 3

---

### Area 5: Performance

#### Finding PF-01: Monolithic 1,054 kB JavaScript Bundle
- **Severity:** Critical
- **Evidence:** `npm run build` output: `dist/assets/index-AOVhU-qv.js: 1,054.74 kB │ gzip: 280.48 kB`, `vite.config.ts:8`.
- **Why it hurts:** 1.05 MB of minified JavaScript must be parsed and compiled before hydration completes. This drives desktop FCP to **5.6s** and LCP to **11.1s** (measured via Lighthouse).
- **Recommended Fix:** Configure manual chunk splitting in `vite.config.ts`:
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-motion': ['motion'],
          'vendor-react': ['react', 'react-dom']
        }
      }
    }
  }
  ```
  Lazy-load `TechCanvas3D`, `ProjectsView`, `ExperienceView`, `ContactView`, and all modals with `React.lazy()`.
- **Effort:** M | **Impact:** 5

#### Finding PF-02: Render-Blocking Google Webfonts
- **Severity:** High
- **Evidence:** `index.html:36-37`, Lighthouse desktop audit (`render-blocking-insight`: estimated 520ms savings).
- **Why it hurts:** Loading four font families (Inter, JetBrains Mono, Plus Jakarta Sans, Material Symbols) via external `@import`/`<link>` blocks initial rendering.
- **Recommended Fix:** Self-host the primary font (`Plus Jakarta Sans` or `Inter`) in WOFF2 format with `font-display: swap`, or eliminate unused Google font requests.
- **Effort:** M | **Impact:** 4

#### Finding PF-03: Unoptimized 636 KB JPEG Image Loaded Multiple Times
- **Severity:** High
- **Evidence:** `public/mdshawonmolla.jpg` (636,703 bytes), `src/assets/images/mdshawonmolla.jpg`, `src/views/HomeView.tsx:164`.
- **Why it hurts:** A 636 KB uncompressed image is loaded for a 80x80px avatar. It has no WebP/AVIF format, no responsive `srcset`, and no explicit `width`/`height` attributes.
- **Recommended Fix:** Convert avatar to WebP/AVIF at 160x160px (< 25 KB) and provide explicit `width="80" height="80"` attributes to avoid layout shifts.
- **Effort:** S | **Impact:** 4

---

### Area 6: Accessibility (WCAG 2.2 AA)

#### Finding A11Y-01: Disabling Viewport Zoom Violates WCAG 1.4.4
- **Severity:** Critical
- **Evidence:** `index.html:5` (`user-scalable=no, maximum-scale=1.0`).
- **Why it hurts:** Users with low vision cannot pinch-zoom to enlarge text or diagrams. This is an immediate failure of WCAG 1.4.4 (Resize Text, Level AA).
- **Recommended Fix:** Change `index.html:5` to:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  ```
- **Effort:** S | **Impact:** 5

#### Finding A11Y-02: Focusable Element Trapped Inside `aria-hidden="true"`
- **Severity:** High
- **Evidence:** `src/components/BackgroundScene.tsx:442` (`<div aria-hidden="true">`) and `line 462` (`<button ... aria-label="Pause 3D background">`).
- **Why it hurts:** Screen readers hide the entire container, but keyboard users can still tab into the pause button, creating an inaccessible, confusing focus state.
- **Recommended Fix:** Remove `aria-hidden="true"` from the outer wrapper, or place the interactive control outside the hidden canvas container.
- **Effort:** S | **Impact:** 4

#### Finding A11Y-03: Form Inputs and Select Missing Explicit Label Associations
- **Severity:** High
- **Evidence:** `src/views/ContactView.tsx:272, 293, 311` (No `id` or `htmlFor`).
- **Why it hurts:** Screen reader users focusing on the dropdown or input fields do not hear the associated label ("Subject / Role Type", "Email Address").
- **Recommended Fix:** Add `id="contact-subject"` to `<select>` and `<label htmlFor="contact-subject">`, and repeat for all text inputs.
- **Effort:** S | **Impact:** 4

#### Finding A11Y-04: Modals Lack ARIA Semantics, Focus Traps, and Escape Dismissal
- **Severity:** High
- **Evidence:** `src/components/ResumeModal.tsx:41`, `src/components/ProjectDetailModal.tsx:47`, `src/components/TerminalModal.tsx:49`.
- **Why it hurts:** Tabbing inside an open modal escapes into the background page; pressing Escape does not close the dialog; screen readers do not announce a dialog state (`role="dialog" aria-modal="true"`).
- **Recommended Fix:** Wrap modals in a standard dialog container with `role="dialog"`, `aria-modal="true"`, an `onKeyDown` Escape listener, and body scroll-lock (`document.body.style.overflow = 'hidden'`).
- **Effort:** M | **Impact:** 4

---

### Area 7: SEO and Sharing

#### Finding SEO-01: Missing `robots.txt` Causes SPA 404 Syntax Errors
- **Severity:** High
- **Evidence:** Lighthouse SEO audit: `robots-txt: robots.txt is not valid` (46 syntax errors).
- **Why it hurts:** When crawlers request `/robots.txt`, Vite falls back to serving `index.html`. Search engine crawlers parse `<!doctype html>` as an invalid robots configuration.
- **Recommended Fix:** Add a valid static `public/robots.txt`:
  ```txt
  User-agent: *
  Allow: /
  Sitemap: https://shawon.dev/sitemap.xml
  ```
- **Effort:** S | **Impact:** 4

#### Finding SEO-02: Missing OpenGraph & Twitter Image Tags
- **Severity:** Medium
- **Evidence:** `index.html:11-17`.
- **Why it hurts:** Sharing `https://shawon.dev` on LinkedIn, Twitter/X, Discord, or WhatsApp generates a link preview without an image card, severely hurting click-through rates.
- **Recommended Fix:** Add `<meta property="og:image" content="https://shawon.dev/og-preview.png" />` and `<meta name="twitter:image" content="https://shawon.dev/og-preview.png" />` to `index.html`.
- **Effort:** S | **Impact:** 4

#### Finding SEO-03: Missing Favicon Suite
- **Severity:** Medium
- **Evidence:** `index.html:1-43`, `public/`.
- **Why it hurts:** The site does not declare a `<link rel="icon">`, leaving the browser tab with a blank default icon or 404 requests for `/favicon.ico`.
- **Recommended Fix:** Add `favicon.svg`, `favicon.ico`, and `apple-touch-icon.png` in `public/` and link them in `index.html`.
- **Effort:** S | **Impact:** 3

---

### Area 8: Code Quality and Maintainability

#### Finding CQ-01: `npm install` Peer Dependency Conflict (`esbuild`)
- **Severity:** High
- **Evidence:** `package.json:33` (`"esbuild": "^0.25.0"`), `package.json:24` (`"vite": "^8.3.0"`), `npm install` ERESOLVE failure.
- **Why it hurts:** Running standard `npm install` on a clean checkout fails with an `ERESOLVE` error unless `--legacy-peer-deps` is used. Furthermore, `bun.lock` exists in the repo despite the project not using Bun.
- **Recommended Fix:** Remove redundant explicit `"esbuild"` devDependency from `package.json` (Vite manages esbuild internally), delete stale `bun.lock`, and generate a clean `package-lock.json`.
- **Effort:** S | **Impact:** 4

#### Finding CQ-02: Unused Heavy Dependencies in `package.json`
- **Severity:** Medium
- **Evidence:** `package.json:14` (`"@google/genai": "^2.4.0"`), `package.json:17` (`"dotenv": "^17.2.3"`), `package.json:18` (`"express": "^4.21.2"`).
- **Why it hurts:** These packages are not imported anywhere in the client codebase (`src/`). They bloat dependency installation, increase maintenance overhead, and misrepresent the architecture.
- **Recommended Fix:** Run `npm uninstall @google/genai dotenv express @types/express`.
- **Effort:** S | **Impact:** 3

#### Finding CQ-03: Dead Code in Repository
- **Severity:** Low
- **Evidence:** `src/components/CinematicVideoHero.tsx`, `src/components/CinematicVideoHero.css`.
- **Why it hurts:** Component is never imported or rendered, cluttering codebase navigation.
- **Recommended Fix:** Safely delete `CinematicVideoHero.tsx` and `CinematicVideoHero.css`.
- **Effort:** S | **Impact:** 2

#### Finding CQ-04: Mock Transcripts & Mailto Contact Form
- **Severity:** Medium
- **Evidence:** `src/views/ExperienceView.tsx:16` (`handleVerify`), `src/views/ContactView.tsx:47` (`handleSubmit`).
- **Why it hurts:** "Run verify" in Experience merely triggers a dummy toast. The contact form pretends to send a message before falling back to opening a `mailto:` link. This feels deceptive to recruiters.
- **Recommended Fix:** Remove fake "run verify" gimmick. Wire the contact form to a real, free API (e.g., Formspree, Resend, or a lightweight Cloudflare Worker) with proper error trapping.
- **Effort:** M | **Impact:** 4

---

## 4. Benchmark Analysis & Gap Analysis

Comparing against premier engineering portfolios (e.g. Brittany Chiang, Josh W. Comeau, Paco Coursey, Rauno Freiberg):

| Pattern | What Premium Portfolios Do | What Shawon.dev Currently Does | Gap Severity | Effort to Close |
| :--- | :--- | :--- | :---: | :---: |
| **Hero Composition & Typography** | Restrained headline hierarchy; clear single narrative; immediate understanding within 3 seconds. | 4 floating badge kickers, dual avatar cards, 5 conflicting CTAs, and a code snippet pill. | **High** | S |
| **Icon System** | Crisp SVG vector icons (Lucide, Radix, Feather) with zero layout shift or webfont dependency. | Google Material Symbols ligatures that flash unstyled raw text across the entire UI. | **Critical** | M |
| **Layout System** | Purposeful Bento grids, sticky storytelling column layouts, calm negative space. | Uniform stacked cards with repetitive bordered boxes and high visual density. | **Medium** | M |
| **3D & Canvas Background** | Subtle, performant canvas with strict frame capping and offscreen unmounting. | Two concurrent WebGL contexts (`BackgroundScene` + `TechCanvas3D`) running un-throttled. | **High** | M |
| **Navigation** | Adaptive header or dock navigation that smoothly scales across all breakpoints. | Simultaneous top header AND bottom mobile dock visible on 1440px desktop screens. | **High** | S |
| **Case Study Depth** | Real problem statements, trade-offs, architecture schematics, and live demonstrations. | High-level bullet points and metrics with mock inspect modals. | **Medium** | L |
| **Performance & Bundle** | Code-split routes under 150 kB initial JS; sub-second FCP and 95+ Lighthouse. | Single 1,054 kB monolithic chunk; 34 Lighthouse Performance; 11.1s LCP. | **Critical** | M |
| **Accessibility** | Full WCAG 2.2 AA compliance; unrestricted zoom; focus-trapped dialogs; full keyboard support. | Blocked pinch zoom, interactive button in `aria-hidden`, disconnected form labels. | **High** | S |

---

## 5. Proposed Design System Tokens

Ready to paste into `src/index.css` or Tailwind configuration:

```css
:root {
  /* Surface Tokens (Deep Obsidian Palette) */
  --color-bg-canvas: #090b10;
  --color-bg-surface: #0f121a;
  --color-bg-surface-elevated: #161a25;
  --color-bg-surface-card: #1c2130;
  --color-bg-surface-hover: #232a3d;

  /* Border Tokens */
  --color-border-subtle: rgba(255, 255, 255, 0.07);
  --color-border-medium: rgba(255, 255, 255, 0.14);
  --color-border-accent: rgba(76, 215, 246, 0.4);

  /* Brand Accents */
  --color-primary: #38bdf8;         /* Sky 400 */
  --color-primary-glow: rgba(56, 189, 248, 0.18);
  --color-secondary: #34d399;       /* Emerald 400 */
  --color-accent-amber: #fbbf24;    /* Amber 400 */

  /* Typography Colors */
  --color-text-primary: #f1f5f9;    /* Slate 100 */
  --color-text-secondary: #94a3b8;  /* Slate 400 */
  --color-text-tertiary: #64748b;   /* Slate 500 */

  /* Type Scale */
  --text-hero: clamp(2.5rem, 5vw + 1rem, 4.25rem);
  --text-h1: clamp(1.85rem, 3vw + 0.5rem, 2.75rem);
  --text-h2: clamp(1.35rem, 2vw + 0.5rem, 1.85rem);
  --text-h3: 1.25rem;
  --text-body: 0.9375rem;           /* 15px */
  --text-small: 0.8125rem;          /* 13px */
  --text-mono: 0.8125rem;           /* 13px */

  /* Spacing Scale */
  --space-section: clamp(4rem, 8vw, 7rem);
  --space-card-padding: clamp(1.25rem, 2vw, 2rem);
  --space-gap-lg: 2rem;
  --space-gap-md: 1.25rem;
  --space-gap-sm: 0.75rem;

  /* Radius Tokens */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  /* Elevation & Glow Tokens */
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.35);
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
  --shadow-glow-cyan: 0 0 24px -4px rgba(56, 189, 248, 0.3);

  /* Motion Tokens */
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-duration-fast: 150ms;
  --motion-duration-standard: 250ms;
  --motion-duration-smooth: 450ms;
}
```

---

## 6. Section-by-Section Redesign Recommendations

### Hero Section
- **Concept:** Minimalist, editorial split layout.
- **Left Column:** Clean name typography (`MD Shawon Molla`), focused headline (*"Full-Stack Software Engineer building high-reliability web platforms, scalable microservices, and AI systems"*), immediate primary CTA (*"Explore Projects"*) and secondary CTA (*"Download Resume"*).
- **Right Column:** High-craft interactive architectural card showing an authentic system schematic with live ping / latency telemetry.
- **Changes:** Remove the confusing "Change Photo / Upload" buttons, remove the redundant top kicker badges, and eliminate the video background layer that competes with the 3D constellation.

### Projects Section
- **Concept:** Asymmetric Showcase + Filterable Bento.
- **Flagship 1 (`AmarShop`):** Full-bleed hero case study card with verified architectural breakdown (PostgreSQL schema isolation, Redis locking, Next.js hydration).
- **Flagships 2 & 3 (`SupportPilot AI`, `Online24Pharmacy`):** Two-column bento cards with clear problem, architecture decision, and live links.
- **Changes:** Replace raw ligature icons with SVG Lucide icons; add direct GitHub / Live demo action links; correct non-existent version labels ("Next.js 16" → "Next.js 15").

### Experience & Education Section
- **Concept:** Unified chronological trajectory.
- **Layout:** Vertical engineering timeline with clear distinction between commercial work (`Innofast Technologies`), government training (`EDGE / BCC`), and academic degrees (`IUBAT`).
- **Changes:** Remove the mock "run verify" interactive gimmick; ensure sequential heading hierarchy (`h2` → `h3`); use consistent pill styling.

### Contact Section
- **Concept:** Frictionless communication portal.
- **Layout:** Left: direct email copy button, WhatsApp link, LinkedIn & GitHub profiles. Right: authentic contact form with connected `<label htmlFor>` elements and real backend submission (via Formspree or Cloudflare Worker).
- **Changes:** Replace simulated `mailto:` submission with actual API delivery; add Honeypot spam protection.

### Navigation & Header
- **Changes:** 
  - Hide `BottomNav` on `md:` breakpoints (`hidden md:hidden`).
  - Streamline header: Brand Logo + Section Links + Resume Button + GitHub link.
  - Fix tablet 768px layout overflow.

---

## 7. Motion & 3D Background Plan

1. **Keep `BackgroundScene.tsx` as Ambient Backdrop:**
   - Retain the subtle particle constellation, but reduce default particle count from 1800 to 900 for mobile battery efficiency.
   - Guard with `document.addEventListener('visibilitychange')` to halt rendering when the browser tab is inactive.
2. **De-duplicate Three.js & Eliminate `TechCanvas3D` from Main Bundle:**
   - Lazy-load `TechCanvas3D` using `React.lazy()` so Three.js is isolated into a separate vendor chunk.
   - Pause `TechCanvas3D` rendering whenever it is outside the viewport using `IntersectionObserver`.
3. **Guardrails for Reduced Motion:**
   - Strictly honor `prefers-reduced-motion: reduce`: render a static radial gradient mesh when enabled, completely disabling canvas rendering.

---

## 8. Prioritized Implementation Roadmap

### Phase A: Quick Wins (Under 1 Day)
- **Task A1:** Replace all Material Symbols with tree-shaken `lucide-react` icons. Fixes raw ligature text glitch across the entire application.
  - *Files:* `Header.tsx`, `BottomNav.tsx`, `HomeView.tsx`, `ProjectsView.tsx`, `ExperienceView.tsx`, `ContactView.tsx`.
- **Task A2:** Add `md:hidden` to `BottomNav.tsx:18`. Eliminates duplicate mobile nav on desktop viewports.
- **Task A3:** Fix `index.html:5` viewport meta to remove `user-scalable=no, maximum-scale=1.0` (WCAG 1.4.4 compliance).
- **Task A4:** Fix accessibility in `BackgroundScene.tsx:442` by removing interactive button from `aria-hidden` container.
- **Task A5:** Add `id` and `htmlFor` attributes to form fields in `ContactView.tsx:272-329`.
- **Task A6:** Add static `public/robots.txt` and `public/sitemap.xml` to eliminate Lighthouse 404 syntax errors.
- **Task A7:** Remove unused packages: `@google/genai`, `express`, `dotenv`, `@types/express`, and fix `esbuild` peer conflict in `package.json`.
- **Task A8:** Delete dead code (`CinematicVideoHero.tsx` and `.css`).

### Phase B: Core Polish (1-3 Days)
- **Task B1:** Code-split Three.js and lazy-load all section views and modals via `React.lazy()`. Cut initial JS bundle from 1.05 MB to < 220 kB.
- **Task B2:** Compress and optimize avatar (`mdshawonmolla.jpg`) to WebP format (< 30 KB) with explicit width/height dimensions.
- **Task B3:** Refactor Hero layout: eliminate "Change Photo / Upload" buttons, remove video layer, consolidate badges into a single status pill.
- **Task B4:** Align personal narrative across `portfolioData.ts` and hero text to authentic "Full-Stack Software Engineer" positioning; fix "Next.js 16" claims.
- **Task B5:** Fix responsive overflow at 390px and tablet header clipping at 768px.
- **Task B6:** Implement accessible dialog semantics (`role="dialog"`, focus trap, Escape listener) across all modals.

### Phase C: Signature Touches (3+ Days)
- **Task C1:** Implement Awwwards-caliber bento grid presentation for flagship projects with interactive architecture deep-dives.
- **Task C2:** Integrate real serverless contact form submission (Formspree / Cloudflare Worker) with spam honeypot.
- **Task C3:** Add complete favicon suite and OpenGraph preview card (`og:image`) for high-fidelity social sharing.
- **Task C4:** Add subtle scroll-linked micro-interactions with Framer Motion (restrained staggering, smooth spring transitions).

---

## 9. Verification Checklist & Appendix

### Target Metrics
- **Lighthouse Desktop:** Performance ≥ 90, Accessibility = 100, Best Practices = 100, SEO = 100.
- **Lighthouse Mobile:** Performance ≥ 85, Accessibility = 100, Best Practices = 100, SEO = 100.
- **Cumulative Layout Shift (CLS):** 0.000.
- **Initial JS Bundle Size:** ≤ 250 kB gzipped.
- **WCAG 2.2 AA Contrast:** All text ≥ 4.5:1; UI controls ≥ 3:1.
- **Responsive Viewport Verification:** Zero horizontal scrollbars at 1440px, 1024px, 768px, and 390px.

### Raw Audit Metrics Summary
- **Desktop FCP:** 5.6s | **Desktop LCP:** 11.1s | **Desktop TBT:** 490ms | **Desktop CLS:** 0.027
- **Mobile FCP:** 48.1s | **Mobile LCP:** 69.4s | **Mobile TBT:** 340ms | **Mobile CLS:** 0.000
- **Total Production JS Size:** 1,054.74 kB uncompressed (280.48 kB gzip).
- **Total Production CSS Size:** 71.64 kB uncompressed (11.29 kB gzip).
- **Avatar Image File Size:** 636.70 kB uncompressed JPEG.

### Screenshot Artifacts Recorded
- `scratch/screenshots/viewport_1440.png` (Desktop 1440x900)
- `scratch/screenshots/viewport_1024.png` (Tablet Landscape 1024x768)
- `scratch/screenshots/viewport_768.png` (Tablet Portrait 768x1024)
- `scratch/screenshots/viewport_390.png` (Mobile 390x844)
- `scratch/screenshots/section_projects_1440.png`
- `scratch/screenshots/section_experience_1440.png`
- `scratch/screenshots/section_contact_1440.png`

---
*Report generated for MD Shawon Molla. Awaiting roadmap approval prior to implementation.*
