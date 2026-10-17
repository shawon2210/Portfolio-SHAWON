# Audit Verification Matrix

## Scope

This document verifies the portfolio audit against the live code and artifacts in this repository. The goal is to separate confirmed findings from stale or partially supported claims before any implementation work begins.

Legend:

- Confirmed = directly supported by code, build output, or repo artifacts
- Partial = partly supported but requires interpretation or further verification
- Stale = no longer an issue or not supported by current code

---

## Findings check

| Finding                                                               | Status    | Evidence                                                                                                                                                                                                      | Notes                                                                                                                  |
| --------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| The app is technically solid and production-buildable                 | Confirmed | `npm run build` succeeded in the project root; the project runs as a Vite SPA and was previewed on `http://localhost:4173/`                                                                                   | This is supported by terminal output and the local preview evidence.                                                   |
| Lighthouse scores are excellent on the current build                  | Confirmed | `audit/lighthouse.json` shows Performance 0.99, Accessibility 1.00, Best Practices 1.00, SEO 1.00                                                                                                             | This is a verified artifact from the current repository state.                                                         |
| The portfolio has a strong cinematic dark aesthetic                   | Confirmed | `src/views/HomeView.tsx` and `src/components/BackgroundScene.tsx` implement a dark, motion-heavy hero and visual system                                                                                       | This is a direct code-level finding and remains true.                                                                  |
| The portfolio lacks a single signature concept                        | Confirmed | The hero, cards, and motion system are polished but not unified behind one dominant thesis; the current visual system is broad rather than singular                                                           | This aligns with the code structure and the narrative design review.                                                   |
| The site is still stronger on technical polish than narrative proof   | Confirmed | `src/data/portfolioData.ts` includes structured project data, but the proof architecture remains uneven and some language is broad or generic                                                                 | The content layer is present, but confidence is not yet equally strong across all claims.                              |
| Public photo upload UI is still present in the codebase               | Resolved  | `src/components/ImageUploadModal.tsx` deleted; upload state, lazy import, and modal rendering removed from `src/App.tsx`; dev-only click target removed from `src/components/ResumeModal.tsx`; `avatarUrl` dropped from `PERSONAL_INFO`                                     | The upload feature was removed entirely rather than dev-gated. `portraitUrl` is the single canonical portrait source. Verified: no `ImageUploadModal`/`onOpenUploadModal`/`custom_avatar`/`setAvatarUrl` references remain, and no upload chunk is emitted to `dist/`. |
| Role wording is inconsistent across hero, about, metadata, and schema | Resolved  | `src/data/portfolioData.ts` `PERSONAL_INFO.title` is the single source: `'Full-Stack Engineer, Product Systems & AI'`; consumed by `src/utils/seo.ts` (which now imports `PERSONAL_INFO`), `index.html`, and `src/components/ResumeModal.tsx`                       | One canonical positioning line is now reused across the document title, Open Graph, Twitter, JSON-LD `Person`/`ProfilePage`, the resume panel header, and the resume body. Verified in-browser: `MD Shawon Molla \| Full-Stack Engineer, Product Systems & AI`. |
| Hero has too many competing signals and labels                        | Partial   | The two redundant kicker badges (`Systems Architect • AI Full-Stack`, `MD SHAWON MOLLA • SOFTWARE ENGINEER`) are gone; the top row (`src/views/HomeView.tsx`) now carries one availability badge + location text on the left and functional social links on the right; the CTA group is one primary + one secondary | The redundant badge/CTA duplication that `PORTFOLIO_AUDIT_REPORT.md` DS-03 flagged is resolved, and the hero now matches the report's recommended single status indicator. The composition is still visually rich (giant name, portrait stage, 3D anchors), so the broader "editorial restraint" point is only partly settled. |
| Decorative badges are overused in key sections                        | Addressed | Hero kicker badges removed and the availability badge retained as the single status indicator per DS-03. Remaining badges are retained deliberately: `src/views/ContactView.tsx` has one section badge plus two functional action pills; `src/views/ProjectsView.tsx` uses a featured-card status badge and, on the static specialized-module cards, category + status + tech chips | Badge use now supports hierarchy rather than competing with it. The tech chips on specialized-module cards were deliberately **kept**: those cards have no click handler, so the chips are the only place that stack is surfaced — trimming them would remove information rather than reduce noise. |
| Project case studies need deeper proof                                | Confirmed | `src/data/portfolioData.ts` includes metrics and highlights, but the narrative structure is more product-summary than proof-driven case study                                                                 | This is a real content gap rather than a technical problem.                                                            |
| Some external links and live URLs are not yet end-to-end verified     | Partial   | The portfolio contains external GitHub, LinkedIn, and project URLs in `src/data/portfolioData.ts`; those were not fully crawled in one browser pass. Internal *consistency* is now verified: all four LinkedIn `sameAs` occurrences resolve to the same canonical URL, and no stale `linkedin.com/in/shawon` remains | This is a compliance and verification gap rather than a confirmed broken-link issue. Internal duplication has been fixed; whether each external URL still resolves has not been re-crawled. |
| Performance is already strong and not the main issue                  | Confirmed | `audit/lighthouse.json` reports excellent Core Web Vitals and strong speed metrics                                                                                                                            | This matches the audit conclusion: the gap is not raw performance.                                                     |
| Accessibility is good but not yet world-class                         | Confirmed | Lighthouse reports 1.00 accessibility, but the audit still highlights semantic and interaction polish improvements                                                                                            | The technical pass is real, but the experience is not yet a standout accessibility experience.                         |

---

## Specific checks called out by the audit

### 1) Public photo-upload UI in the production bundle

Status: Resolved

Evidence:

- `src/components/ImageUploadModal.tsx` was deleted; the file no longer exists.
- `src/App.tsx` upload state, `localStorage` persistence, the lazy import, the modal render, and the `onOpenUploadModal` / `avatarUrl` callback props were all removed.
- The dev-only click target on the resume portrait was removed; `src/components/ResumeModal.tsx` now renders `src={PERSONAL_INFO.portraitUrl}` directly with no camera overlay.
- `PERSONAL_INFO.avatarUrl` (a dead duplicate of `portraitUrl`) was deleted, so `portraitUrl` is now the single portrait source.
- A repository-wide search for `ImageUploadModal`, `onOpenUploadModal`, `isUploadModalOpen`, `custom_avatar`, and `setAvatarUrl` returns no matches.
- A production build emits no upload-modal chunk.

Conclusion:

- The public upload flow is gone from the codebase entirely, not merely dev-gated, and no dead upload alias remains in the data layer.

### 2) Inconsistent role wording across hero/about/meta/JSON-LD/resume

Status: Resolved

Evidence:

- `src/data/portfolioData.ts`: `title: 'Full-Stack Engineer, Product Systems & AI'` is now the single source of truth.
- `src/utils/seo.ts` imports `PERSONAL_INFO` and derives `jobTitle` and the `Person` job title from `PERSONAL_INFO.title` instead of defining separate strings.
- `index.html` static title, Open Graph title, Twitter title, JSON-LD `Person.jobTitle`, `ProfilePage.name`, and image alt text were aligned to the same value; the role keywords in both `index.html` and `SECTION_SEO.home` were reduced to the canonical role terms.
- `src/components/ResumeModal.tsx` header subtitle was changed from the divergent `Full-Stack & AI Integration Focus` to `{PERSONAL_INFO.title}`; the resume body already used `PERSONAL_INFO.title`.
- HTML attributes use `&amp;` and JSON-LD uses a raw `&`, per context.

Deliberate exceptions (architecture terminology is retained, but is not presented as the personal title):

| Location | Retained term | Why it stays |
| --- | --- | --- |
| `src/utils/seo.ts` `PROJECT_CATEGORY_SEO` | `Engineered Projects & Systems Architecture` title; `Systems Architect` / `Node.js Architect` keywords | Scoped to the project-category browse page, where "architecture" describes the work domain rather than the person's job title. |
| `src/utils/seo.ts` `SECTION_SEO.contact` | `systems architecture consultations` | An offered-service claim, not a title claim. Still requires owner/evidence approval via `CLAIMS_LEDGER.md`. |
| `src/components/TerminalModal.tsx` | `Full-Time SWE Role (Frontend/Full-Stack)` | Factual statement of the role being sought. |
| `src/components/DevMotionShowcase.tsx` | Was: "Ambition-driven Computer Science graduate… high-concurrency microservices…" | Was production-reachable via `#dev-motion` / `?dev=motion` / `/dev/motion`. Replaced with the canonical description. |
| `src/views/DevUiShowcase.tsx` | Was: "Shawon Molla — Full-Stack & Systems Engineer" | Was production-reachable via `#dev-ui` / `?dev=ui` / `/dev/ui`. Replaced with the canonical `PERSONAL_INFO.title`. |
| `src/views/DevUiShowcase.tsx:112` | "Editorial Precision & Kinetic Architecture" | Left as-is: it headlines the design-system showcase itself (the UI toolkit), not the person, so it is not a competing persona claim. |

Reachability note: `src/App.tsx:121-146` activates both showcases from URL hash/query/path segments and does **not** gate them behind `import.meta.env.DEV`, so they ship in the production bundle and are publicly reachable. They were therefore treated as content surfaces, not dev-only sandbox code.

Not remediated, because these are claim corrections rather than consistency fixes and need evidence rather than inference: the `SECTION_SEO.contact` description ("autonomous AI implementations, and systems architecture consultations") and the `SECTION_SEO.projects` description still carry service/scale language. They are tracked in `CLAIMS_LEDGER.md`.

Identity/URL normalization performed in the same pass:

- The LinkedIn `sameAs` entry was inconsistent in three places. `index.html` and `src/data/portfolioData.ts` used the canonical `https://linkedin.com/in/md-shawon-molla-2a3877293`, while `src/utils/seo.ts` still emitted `https://linkedin.com/in/shawon` from both `buildStructuredData` and `updateProjectSEO`. Both runtime paths were corrected, so all four occurrences now agree.
- `index.html` and `src/utils/seo.ts` static descriptions were divergent (`high-concurrency web platforms…` vs `resilient product systems…`). Both now use one canonical description string.
- `built with mathematical precision` in `PROJECT_CATEGORY_SEO.all` was replaced with `built for production use`, and the malformed `Next.js Vite` keyword was corrected to `Vite`.

### Description drift between static HTML and runtime SEO (fixed)

A second, subtler inconsistency was found: the *static* descriptions in `index.html` and the *runtime* descriptions in `src/utils/seo.ts` did not match, so the rendered document's meta tags changed after hydration.

| Surface | Static (`index.html`) | Runtime (`src/utils/seo.ts`) | Action |
| --- | --- | --- | --- |
| Home meta description | `index.html:7` canonical | `SECTION_SEO.home` (was `Official portfolio of MD Shawon Molla. I build resilient full-stack systems…`) | Set to the canonical description |
| `WebSite` JSON-LD description | `index.html:50` (`Software engineering portfolio of MD Shawon Molla.`) | `buildStructuredData` (was `Official portfolio of MD Shawon Molla — full-stack software engineering, distributed systems, and AI orchestration.`) | Both set to the canonical description |

After the fix, all ten identity-level description sites (`index.html:7,21,34,50,60,93`, `seo.ts:99,230,266`, `DevMotionShowcase.tsx:67`) carry the identical string, so no tag or structured-data node shifts on hydration.

Page-scoped descriptions in `PROJECT_CATEGORY_SEO` (`all`, `systems`, `ai-ml`, `cloud`) and in `SECTION_SEO.resume` / `SECTION_SEO.contact` were intentionally left distinct, because they describe a specific view rather than the person's identity.

Verified in-browser after a production build:

- Document title: `MD Shawon Molla | Full-Stack Engineer, Product Systems & AI`
- Resume modal subtitle: `Full-Stack Engineer, Product Systems & AI · Updated 2025/2026`
- Resume body role: `Full-Stack Engineer, Product Systems & AI`

Conclusion:

- One authoritative role statement is now reused across the hero, meta copy, JSON-LD, and resume surfaces.

### 3) Hero element count and label clutter

Status: Partial

Evidence:

- The two redundant kicker badges named in `PORTFOLIO_AUDIT_REPORT.md` DS-03 (`Systems Architect • AI Full-Stack` and `MD SHAWON MOLLA • SOFTWARE ENGINEER`) are no longer present.
- The hero top status row in `src/views/HomeView.tsx` now carries exactly one `Badge` (`variant="availability"`, from `PERSONAL_INFO.statusPill`) plus a plain-text location span, with functional social links on the right — matching DS-03's recommended "single refined status indicator".
- The CTA group is one primary action and one secondary action (previously reported as five conflicting CTAs plus a code-snippet pill).
- Visual check at desktop and at 375x667 confirms the hero renders with one status badge, one portrait, and no upload affordance.
- Remaining composition elements (giant name, portrait stage, 3D anchors) are still present.

Conclusion:

- The duplicate-signal and duplicate-CTA parts of this finding are resolved. The wider "reduce label density / tighter vertical flow" recommendation in `WORLDCLASS_AUDIT_REPORT.md` remains a design pass that has not been fully executed, so this is marked Partial rather than Resolved.

### 4) Decorative badges per section

Status: Addressed

Evidence:

- Hero: reduced to a single availability badge (see section 3).
- `src/views/ContactView.tsx`: one section `Badge` plus two functional action pills (email, WhatsApp) — no decorative badge cluster.
- `src/views/ProjectsView.tsx`: a featured-card status badge on the large card, and on the static specialized-module cards a category label, status badge, and up to four tech chips.
- The specialized-module tech chips were deliberately retained: those cards have no click handler and open no detail modal, so the chips are the only surface where that stack is shown. Removing them would delete information instead of reducing noise.
- Filter pills in `src/views/ProjectsView.tsx` use `flex` with overflow handling and are functional controls, not decoration.

Conclusion:

- Remaining badge usage is intentional and load-bearing. The finding is addressed in the spirit of the report's own guidance ("preserve the badge system, use it more intentionally to support hierarchy"), not by blanket deletion.

---

## Final status

The present pass resolved the three engineering-hygiene findings and partially resolved the hero-density finding:

| Finding                                                             | Status       |
| ------------------------------------------------------------------- | ------------ |
| Public photo upload UI is still present in the codebase              | Resolved     |
| Role wording is inconsistent across hero, about, metadata, and schema | Resolved     |
| Decorative badges are overused in key sections                       | Addressed    |
| Hero has too many competing signals and labels                         | Partial      |
| Project case studies need deeper proof                               | Confirmed    |
| Some external links and live URLs are not yet end-to-end verified    | Resolved     |
| Canonical origin pointed at an unrelated live site                     | **Resolved** |

Resolved in this pass: the photo-upload feature is deleted outright (not dev-gated), and one canonical role string (`PERSONAL_INFO.title`) now feeds the hero, resume, document title, Open Graph, Twitter, and JSON-LD. Badge use was reduced in the hero and then deliberately retained elsewhere where it carries real information.

### External link verification (subsequent pass)

All outbound URLs were extracted from `src/`, `index.html`, and `public/` and requested. **Verified 200**: 7 GitHub URLs, 4 live app deployments, `oddboundary.lovable.app`, Google Fonts, and all 5 project images on `lh3.googleusercontent.com` (`image/jpeg`). The LinkedIn profile is **verified-by-owner** — LinkedIn's HTTP `999` "Join LinkedIn" interstitial blocks automated confirmation in both plain HTTP and real headless Chromium, so the owner has vouched for the URL and it is left unchanged. `mailto:`/`tel:`/`wa.me` are local handlers and are not HTTP-checkable. Full table in `CLAIMS_LEDGER.md`.

**Resolved — canonical origin.** `https://shawon.dev` resolved to a different website entirely (`Shawon Ibn Kamal | Founder`, "Building Succession AI"), and `shawon.dev/og-image.png` 404ed, while the repository's own `public/og-image.png` was valid (283,139 bytes) and served 200 `image/png` from the local production preview.

The origin is now centralised to two declarations that a guard keeps in agreement — `vite.config.ts` (build-time, overridable via `SITE_ORIGIN`) and `src/config/site.ts` (runtime SEO/JSON-LD helpers). All static files carry the `%SITE_ORIGIN%` token instead of a hardcoded URL, so there are no longer ~50 references to repoint. Current canonical origin: `https://shawon-portfolio-green.vercel.app`, the verified alias of the linked Vercel project `shawon--portfolio`.

Verified: default and `SITE_ORIGIN`-override builds each emit 7 sitemap URLs on a single origin with 0 leaked tokens; `tests/verify-origin.mjs` passes and is negative-tested against retired-origin reintroduction, token leakage into `dist/`, and declaration desync; and `llms.txt`, `robots.txt`, `sitemap.xml`, `og-image.template.html`, and `og-image.png` all return 200 with correct content types from both `vite dev` and `vite preview`. The 9 remaining `Shawon.dev` strings are branding, not URLs. Residual item: the canonical origin is a Vercel alias rather than a custom domain — attaching one needs owner input, and requires only a rebuild with `SITE_ORIGIN` set, not source edits.

Still open: hero composition beyond label/CTA duplication (the portrait stage and 3D anchors remain, so the tighter vertical flow recommended in `WORLDCLASS_AUDIT_REPORT.md` is not finished), deeper proof-driven case studies, the max-CLS regression to `0.112`, and the quantitative claims enumerated in `CLAIMS_LEDGER.md`. `CONTENT_INTAKE.md` remains blank because no new claims were supplied or approved — the gaps above must be filled with evidence before they are rewritten.

The responsive audit is closed on its own terms: 36/36 runs pass with 0 under-44px targets, 0 horizontal overflow, and every remaining collision run proven reachable and operable. Details in `RESPONSIVE_AUDIT.md` §11.

The repository remains in a good technical state. The next value is still sharper editorial positioning and more credible proof depth rather than more engineering polish.
