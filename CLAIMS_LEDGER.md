# Claims Ledger

## Purpose

This ledger captures the current claims, role language, metrics, and portfolio assertions in the project so they can be reviewed against source evidence and either kept, revised, or removed.

Rules:

- Every metric or claim needs a source note.
- If a claim cannot be verified, it must be removed or labeled as approximate.
- This ledger is a working document for editorial approval before any design rewrite begins.

---

## Current portfolio claims

| Claim / metric                                                                                            | Source file(s)                                        | Status               | Notes                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Name: MD SHAWON MOLLA / MD Shawon Molla                                                                   | `src/data/portfolioData.ts`                           | Verified             | Canonical name used across hero, metadata, and resume surfaces.                                                |
| Role title: `Full-Stack Engineer, Product Systems & AI`                                     | `src/data/portfolioData.ts` (`PERSONAL_INFO.title`) | Canonical           | Single source of truth. Consumed by `src/utils/seo.ts`, `index.html`, and `src/components/ResumeModal.tsx`. No parallel phrasing remains in metadata or the resume. |
| Location: Dhaka, Bangladesh                                                                               | `src/data/portfolioData.ts`                           | Verified             | Used in hero and contact surfaces.                                                                             |
| Email: `22103330@iubat.edu`                                                                               | `src/data/portfolioData.ts`                           | Verified in code     | This is a direct contact claim.                                                                                |
| Phone: `+880 1987-407441`                                                                                 | `src/data/portfolioData.ts`                           | Verified in code     | Direct contact claim.                                                                                          |
| GitHub URL: `https://github.com/shawon2210`                                                              | `src/data/portfolioData.ts`                           | Verified in code     | Link target is present; live validation is still recommended.                                                  |
| LinkedIn URL: `https://linkedin.com/in/md-shawon-molla-2a3877293`                                        | `src/data/portfolioData.ts`                           | Verified in code     | Link target is present; live validation is still recommended.                                                  |
| WhatsApp URL: `https://wa.me/8801987407441`                                                                | `src/data/portfolioData.ts`                           | Verified in code     | Link present; live validation recommended.                                                                     |
| Portrait asset: `portraitUrl: '/mdshawonmolla.jpeg'`                                                     | `src/data/portfolioData.ts`, `src/components/ResumeModal.tsx` | Verified      | Sole portrait source. The duplicate `avatarUrl` field was deleted along with the upload feature.                |
| Status pill: `Open to Product, AI & Full-Stack Roles`                                                     | `src/data/portfolioData.ts`, `src/views/HomeView.tsx` | Verified in code     | Rendered once, as the hero's single availability `Badge`. Should be aligned with actual hiring intent.            |
| Availability detail: `Remote / Hybrid / Relocation`                                                        | `src/data/portfolioData.ts`                           | Verified in code     | Less committal than the previous "Immediate Hire" phrasing, so it carries lower approval risk.                 |
| Hero role pill rotates `Full-Stack Engineer` / `Product Systems` / `AI-Enabled Delivery`                   | `src/views/HomeView.tsx`                              | Verified in code     | Deliberately restrained: all three entries are facets of the canonical title, not competing job titles.        |
| Bio: `Product-minded full-stack engineer building resilient products and AI-enabled systems...`             | `src/data/portfolioData.ts`                           | Verified in code     | Explicit self-description; tone and factual accuracy still need owner approval.                                 |
| `Seeking an entry-level software engineering role...`                                                     | —                                                    | Removed              | String no longer exists anywhere in the source. The earlier entry-level framing was replaced by the product-engineer bio above. |
| `AmarShop` project exists — `97` PG Tables, `4-Tier` RBAC Guards, `4 Rails` Payments                   | `src/data/portfolioData.ts` (metrics, lines 38-40)    | Verified in code     | Three numeric claims. All still require validation against the real project source before publication.          |
| `JWT authentication` with refresh-token / Redis claims                                                      | `src/data/portfolioData.ts`                           | Verified in code     | `JWT` and `Redis` both still present. Do not publish the mechanism detail as fact without project evidence.    |
| `Real-time WebSocket dispatcher`                                                                          | `src/data/portfolioData.ts`                           | Verified in code     | Can stay if project evidence supports it.                                                                      |
| `Integrated payment rails` — SSLCommerz only                                                              | `src/data/portfolioData.ts`                           | Verified in code     | **Corrected:** the earlier ledger listed bKash and Nagad; neither string exists in the source. SSLCommerz is the only named provider. |
| `SupportPilot AI` project exists — `97 Tests` PyTest, `7 LLMs` Hot Swappable, `29 Pages` Next 15          | `src/data/portfolioData.ts` (metrics, lines 101-103)  | Verified in code     | Three numeric claims; all require evidence.                                                                   |
| `Online24Pharmacy` project exists — `-50%` Support Load, `4 Roles` End-to-End, `25+` Secured Routes      | `src/data/portfolioData.ts` (metrics, lines 157-159)  | Verified in code     | `-50%` is an outcome claim and needs the strongest evidence of the set.                                         |
| `Shohel Pharmacy System` project exists — `20+` Endpoints, `6` Modules                                    | `src/data/portfolioData.ts` (metrics, lines 211-212)  | Verified in code     | Lower-risk counts; verify before publication.                                                                  |
| `Bangla Fake News Detection` project exists — `+23.5%` Metric Boost, `19` Unit Tests, BanglaBERT/Transformer | `src/data/portfolioData.ts` (metrics, lines 235-260) | Verified in code     | **Not previously in this ledger.** The `+23.5%` outcome claim needs explicit provenance.                       |
| Lighthouse audit metric: `64 → 91 (+27)` and `-30% latency` page load                                    | `src/data/portfolioData.ts`                           | Verified in code     | **Not previously in this ledger.** Conflicts with the repo-level `audit/lighthouse.json` (Perf 0.99); reconcile before publishing. |
| Education stats: `3.35 / 4.00` CGPA, `5.00` GPA, `80h Certified`                                        | `src/data/portfolioData.ts`                           | Verified in code     | **Not previously in this ledger.** Transcribe supporting certificates if these are shown.                       |
| `Full-Time SWE Role (Frontend/Full-Stack)` email subject                                                  | `src/views/ContactView.tsx`                           | Verified in code     | Two occurrences. Direct hiring-intent language; confirm this still matches the intended scope.                   |
| `Portfolio is 74/100 and award-level gap is content + positioning`                                        | `WORLDCLASS_AUDIT_REPORT.md`                          | Internal audit claim | Not a public portfolio claim, but it should be treated as editorial evaluation rather than public-facing copy. |

---

## Unverified or high-risk claims

These should be treated as pending until confirmed with real project evidence or customer-side validation:

- The exact database table count for `AmarShop` (`97`)
- The exact `97 Tests` / `19 Unit Tests` automation coverage claims
- `-50% Support Load` and `+23.5% Metric Boost` — outcome claims with no cited provenance
- The Lighthouse `64 → 91 (+27)` / `-30% latency` figures, which contradict the repo-level `audit/lighthouse.json` result (Performance 0.99) and must be reconciled or removed
- ~~The https://shawon.dev canonical origin~~ — **resolved**; see "Canonical origin — resolved" below
- ~~Max CLS `0.112` recorded in `RESPONSIVE_AUDIT.md` §11, which regressed from `0.073`~~ — **resolved**; the portrait frame reserved no height before image decode. See "Max CLS — resolved" below.
- Exact LLM/provider integration statements (`7 LLMs` hot-swappable, BanglaBERT fine-tuning)
- Real production results and launch metrics for business platforms
- “Open to Product, AI & Full-Stack Roles” (`PERSONAL_INFO.statusPill`) if that is not the current intent. The contact form subject is now `Full-Time Role (Frontend / Full-Stack)`, aligned to that pill; the parallel `SWE Role` phrasing is gone.
- Any claim that sounds more impressive than the project evidence supports

---

## External link reachability (2026 audit pass)

Every outbound URL in `src/`, `index.html`, and `public/` was extracted and requested. "Verified" means an observed HTTP 200 with the expected content type — not merely that the string looks plausible.

| Link group | Count | Result |
|---|---:|---|
| GitHub profile + 6 repositories | 7 | **Verified 200** |
| Live app deployments (`amarshop-eight`, `online24pharmacy`, `shohel-pharmacy`, `supportpilot-ai-phi`) | 4 | **Verified 200** |
| `oddboundary.lovable.app` | 1 | **Verified 200** |
| Project images on `lh3.googleusercontent.com` | 5 | **Verified 200 `image/jpeg`** |
| `fonts.googleapis.com` stylesheet | 1 | **Verified 200** |
| LinkedIn profile | 1 | **Verified by owner — not machine-verifiable** (see below) |
| `mailto:22103330@iubat.edu`, `tel:`/`wa.me` | 3 | Local handlers, not HTTP-checkable |

**LinkedIn — owner-verified.** `linkedin.com/in/md-shawon-molla-2a3877293` returns HTTP `999` with a "Join LinkedIn" interstitial in a real headless Chromium session, so automation cannot confirm or refute the profile. The owner has confirmed the URL is correct; it is therefore recorded as **verified-by-owner** rather than machine-verified, and is left in place unchanged.

### Canonical origin — resolved

**Retired.** `https://shawon.dev` resolved to an unrelated live site (`Shawon Ibn Kamal | Founder`); `shawon.dev/og-image.png` returned 404. It is no longer referenced as a URL anywhere in source or build output.

**Current canonical origin:** `https://shawon-portfolio-green.vercel.app` — the verified alias of the linked Vercel project `shawon--portfolio` (`prj_dgQ7tpIU8mTg0TG3nNaw5RWpf5ta`, team `team_F1cEOGelGW4yPCGOAidAOOk8`).

Origin is now declared in exactly two places, which a guard keeps in agreement:

| Declaration | Role | Override |
|---|---|---|
| `vite.config.ts` | Build-time default; substituted into `%SITE_ORIGIN%` tokens and used by the dev-server middleware | `SITE_ORIGIN` env var |
| `src/config/site.ts` | Runtime default for SEO/JSON-LD helpers (`siteOrigin`, `absoluteUrl`, `originForEnvironment`) | same env var |

All static files (`index.html`, `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`, `public/og-image.template.html`) use the `%SITE_ORIGIN%` token, so there is no hardcoded production URL to drift. About 12 `Shawon.dev` strings remain as **branding/display only** (site name, OG `site_name`, wordmark, image alt text — zero are URLs) and **3 are the retired-origin denylist** in `tests/verify-origin.mjs` (`https://shawon.dev`, `https://www.shawon.dev`, plus a comment), which must stay so the guard can fail on reintroduction. No source file references a retired origin as a live URL.

**Verification.** `tests/verify-origin.mjs` asserts that both declarations parse to the same bare origin, that no retired origin or hardcoded canonical literal appears in any scanned source file, and that the built `dist/` contains no leaked `%SITE_ORIGIN%` token. It is negative-tested: reintroducing a retired origin, leaking a token into `dist/`, or desynchronising the two declarations each make it exit 1.

Build matrix — all passing:

| Build | Canonical in `dist/index.html` | Sitemap URLs | Token leaks |
|---|---|---|---|
| default | `https://shawon-portfolio-green.vercel.app` | 7, single origin | 0 |
| `SITE_ORIGIN=https://example.com` | `https://example.com` | 7, single origin | 0 |

`llms.txt`, `robots.txt`, `sitemap.xml`, `og-image.template.html`, and `og-image.png` were each requested against both `vite dev` (public files via dev middleware) and `vite preview` (built `dist/`): **10/10 returned HTTP 200 with correct content types, no leaked tokens, and the canonical origin present.**

**Remaining caveat (not a defect).** The canonical origin is a Vercel alias, not a custom domain. The project has no custom domain attached, so final branded-domain publication still requires owner input. When one is added, rebuild with `SITE_ORIGIN=https://<domain>` and re-run `node tests/verify-origin.mjs` plus `tests/smoke-production.mjs`; no source edits are required.

### Max CLS — resolved

**Defect.** `.profile-portrait__frame` reserved no height. It had no `aspect-ratio` and the `<img>` used `height: 100%`, so before the image resolved the frame collapsed to its 1px borders. A `layout-shift` source probe measured the portrait at `h:3 → h:396` and named it as the dominant shift at every viewport.

**Fix.** `.profile-portrait__frame` now declares `width: 100%; aspect-ratio: 7 / 9`, matching the pre-cropped 7:9 source that `scripts/build-portrait.mjs` already bakes. The box is reserved before decode, so no shift can occur.

**Verification.** Per-viewport `layout-shift` attribution, six breakpoints, after rebuild: 320×568 `0.0000`, 390×844 `0.0000`, 768×1024 `0.0042`, 1024×1366 `0.0025`, 1440×900 `0.0080`, 1920×1080 `0.0234`. Worst case **0.0234** (was `0.112`), inside the "good" band. Recorded in `RESPONSIVE_AUDIT.md` §11.

This ledger previously described a codebase state that no longer exists. Corrections made against the current source:

- Canonical role is `Full-Stack Engineer, Product Systems & AI`; the old `Full-Stack Software Engineer · AI Systems Architecture` and `Software Engineer & Systems Architect` strings are gone.
- SEO title and `Person` JSON-LD `jobTitle` are no longer independently authored — both derive from `PERSONAL_INFO.title`, so they can no longer drift.
- The hero role pill no longer rotates competing titles; it cycles three facets of the canonical title.
- The `Seeking an entry-level software engineering role...` bio and the `distributed platform architecture` recruiter line were removed earlier in the rewrite.
- Payment rails: `bKash` and `Nagad` are no longer named anywhere. `SSLCommerz` is the only provider still referenced.
- `avatarUrl` was deleted with the upload feature; `portraitUrl` is the only portrait field.
- Several metrics were absent from this ledger and have now been added (Shohel Pharmacy counts, Bangla Fake News metrics, Lighthouse figures, education stats).

---

## Approval status

This ledger is the working source of truth for the current design rewrite. It should be reviewed and approved before any public-facing copy is changed.

No new claims were authored or approved during this pass; the corrections above only reconcile the ledger with code that already exists. `CONTENT_INTAKE.md` remains blank, so every item in the high-risk list above is still unapproved and must be filled with owner-supplied evidence before it is published.

---

## Decision rule

Before publishing, every claim must be tied to one of the following:

1. A verified project source file in this repo
2. A genuine public deployment or live link
3. A recorded outcome from the owner with a clear date and source note
4. A clearly labeled approximation or estimated statement

If none of the above apply, the claim should be removed or rewritten in more generic language.
