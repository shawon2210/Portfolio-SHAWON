# World-Class Portfolio Audit

## Phase 0: Recon Summary

This portfolio is now materially stronger than the earlier 52/100 baseline. The project is a modern Vite + React 19 + Tailwind v4 + Motion + Three.js single-page portfolio, with a curated set of real projects and good production build hygiene. The current build passes a clean local production preview and Lighthouse is excellent on technical performance and basic quality signals.

What is genuinely strong:

- The app is technically coherent and production-buildable. Evidence: `npm run build` completed successfully on the current project, and the Vite build output shows the app shipping as a static bundle with no console errors in Lighthouse.
- The portfolio has a clear homepage narrative and a polished cinematic hero composition. Evidence: the local preview at `http://localhost:4173/` renders the name treatment, social row, and framed portrait as a deliberate hero composition.
- The site has meaningful project data and real project categories. Evidence: `src/data/portfolioData.ts` contains structured projects and visible route sections.
- The app has a strong 3D/dark aesthetic and thoughtful motion approach. Evidence: `src/components/BackgroundScene.tsx` and `src/views/HomeView.tsx` implement a scene and hero choreography rather than a generic landing page.

However, this is still not award-winning developer portfolio work. Award-winning work feels authored, deeply specific, and narratively credible. This site currently feels more like a high-quality personal product than a category-defining portfolio. The biggest gap is not raw performance; it is the absence of a singular signature concept, more credible proof depth, and sharper portfolio positioning.

### Stack and architecture snapshot

- Frontend: React 19 + Vite + Tailwind v4 + Motion + Three.js
- Main view structure: `src/App.tsx`, `src/views/HomeView.tsx`, `src/views/ProjectsView.tsx`, `src/views/ExperienceView.tsx`, `src/views/ContactView.tsx`
- Motion system: `src/components/motion/*`, `src/lib/motion.ts`, plus `useLoadPhase` and scroll-driven motion patterns
- 3D scene: `src/components/BackgroundScene.tsx` and `src/components/TechCanvas3D.tsx`
- Assets pipeline: `scripts/build-portrait.mjs`, `scripts/build-stage-portrait.mjs`, `src/data/portraitManifest.ts`, `public/portrait/*`
- Deployment: Vercel production deployment, with static Vite output and a production preview available locally
- Forms/analytics: no evidence of a live backend form or analytics pipeline in the current checked code; the app appears static and deploy-only

### Content inventory check

- Projects are real, but not yet all equally proven. `src/data/portfolioData.ts` includes multiple case studies with structured metrics and claims.
- Links were not all validated end-to-end in a browser crawl, so some external social and live links remain only partially verified.
- The bigger issue is not link breakage; it is content confidence. Some claims are credible, while others read like polished but slightly inflated product language rather than hard proof.

---

## Phase 1: Measurement Summary

Measured values from the current production build and local preview:

- `npm run build` completed successfully.
- Lighthouse on `http://localhost:4173/` produced: Performance 0.99, Accessibility 1.00, Best Practices 1.00, SEO 1.00.
- Core Core Web Vitals from Lighthouse: FCP 0.6s, LCP 0.7s, Speed Index 0.9s, TBT 60ms, CLS 0.0, max potential FID 150ms.
- Production bundle: `dist/assets/three-vendor-mdErbku1.js` is still the largest chunk at 537 KB; main app chunk is around 96 KB. This is good but still not ideal for a world-class portfolio.

This means the site is strongest on technical execution and polish. The gap to award-winning work is not major-performance failure; it is narrative depth and signature originality.

### Benchmark against the 52/100 baseline

- Baseline reported: 52/100
- Current reality: approximately 74/100 in a calibrated scorecard
- Improvement: +22 points
- Verdict: good, not award-level

This is a meaningful step up, but it is still below top-tier portfolio standards because award winners usually feel more editorially sharp, more specific, and more conceptually memorable than this site currently does.

---

## Phase 2: Expert Review Summary

### A. Concept and art direction: 72/100

The concept is strong but not singular. The dark neon cyber-portfolio aesthetic is coherent and high-end in tone. The problem is that it is still broad in meaning: a strong visual system without a memorable narrative thesis. It reads as a polished portfolio, not a personally authored world-class brand.

### B. Visual craft: 76/100

The typography, spacing, and dark UI language are generally competent. The principal risk is not brutality of craft but lack of editorial restraint. Too many pills, labels, and decorative elements compete for attention. The design feels mature but not iconic.

### C. Motion design: 75/100

Motion is thoughtfully integrated, but it is more decorative than memorable. It does not yet create a signature interaction language: the site feels polished but not distinctive.

### D. 3D and graphics quality: 74/100

The background scene and portrait stage are thoughtfully implemented. The visual quality is good, but it is not yet the central reason someone remembers the site. The 3D is a supporting system, not a unique idea.

### E. Interaction design: 78/100

Navigation, hover states, and microinteractions are mostly mature. The site is pleasant to use, but not yet a reference standard for tactile delight or frictionless conversion.

### F. UX, IA, conversion: 77/100

The structure is understandable and the CTA flow is serviceable. But the main conversion problem is not navigation confusion; it is that the content still does not clearly answer one question: “Why is this person worth hiring above others?”

### G. Content and storytelling: 60/100

This is the biggest gap. The project case studies are better than average, but many claims need deeper proof, more tangible numbers, and a more focused position. The site is stronger than many personal portfolios, but it is not yet deep enough to win awards or command trust at a senior hire level.

### H. Responsiveness and mobile: 72/100

Mobile is good in a broad sense, but the earlier overflow problems were a real issue. The current project has improved significantly, but a mobile-first award-level portfolio still needs stronger evidence of a clean small-screen editorial rhythm.

### I. Performance and technical excellence: 85/100

This is one of the strongest dimensions. The build and Lighthouse results are excellent. The site is technically performant enough to be competitive.

### J. Accessibility and inclusivity: 82/100

The current site is better than the earlier baseline, but accessibility is not yet a world-class differentiator. There are no obvious console errors in Lighthouse, but design polish and screen-reader semantics still deserve a final pass for complete confidence.

### K. SEO and discoverability: 80/100

The site has structured metadata and a coherent hero narrative. It is discoverable and technically sound. The remaining gap is not basic SEO; it is brand-level proof, searchability, and more consistent positioning language.

### L. Reliability, security, and craft details: 78/100

The static delivery is reliable. Known output is stable and the site builds cleanly. The missing edge is polish: an intentional favicon, deeper error states, clearer deploy/hosting strategy, and stronger brand clarity.

### Awwwards-style weighted estimate

Using the requested approximation:

- Design 40%: ~76/100
- Usability 30%: ~78/100
- Creativity 20%: ~72/100
- Content 10%: ~60/100
  Weighted estimate: ~74/100

This is a good portfolio, but not a top-tier award-winning developer portfolio. Award winners usually sit around 88–95, with stronger narrative clarity and a more original signature.

### CSS Design Awards style estimate

- UI: ~78/100
- UX: ~77/100
- Innovation: ~73/100
  CSS Design Awards-level winners are usually more memorable, more authored, and more strategic in the way they guide the eye. This site is polished, not singular.

---

## Phase 3: Persona Walkthroughs

### 1) Technical recruiter on a phone, 30 seconds

What they want: “Who is this? What role? Can I contact quickly?”
Current reality: yes, they can understand the name and the broad role quickly. The hero and CTA flow are readable. However, the profile still does not give a crisp, canonical line such as “Full-stack engineer specializing in AI and scalable product systems” with a solid outcome ladder. The site could be clearer and more decisive.

### 2) Hiring manager on desktop, 3 minutes

What they want: “Can I judge skill depth? Do claims look credible?”
Current reality: the background and motion are strong, but the proof layer is uneven. The portfolio needs deeper project narratives with explicit context, role, constraints, decisions, and outcomes. The content is decent, but not yet enough for strong hiring trust at a senior level.

### 3) Senior engineer

What they want: “Does the code/architecture signal real craft?”
Current reality: the technical stack reads credible, but the site still feels like a polished portfolio shell rather than a deeply engineered technical narrative. Senior engineers want proof, not just the presence of frameworks.

### 4) Designer/creative director

What they want: “Does it feel original and refined?”
Current reality: the visual language is definitely refined, but it is not yet signature. Good aesthetics are not enough; award-level portfolios leave a memorable visual imprint.

### 5) Potential freelance client

What they want: “Do I trust this person? How do I start?”
Current reality: the trust is decent but not exceptional. Better proof, client-ready phrasing, and stronger outcome articulation are needed.

### 6) Keyboard-only and screen-reader user

Current reality: likely workable, but not yet verified as world-class. The site is technically accessible enough to pass broad checks, but the experience needs a pass for semantic clarity and strong focus states across all interactions.

### 5-second hero test result

- Hero is clear and high-impact within 5 seconds.
- The first mobile screen is understandable, but not yet a complete “I know exactly who this person is and why they matter” moment.

---

## Phase 4: Benchmark and Gap Analysis

### Transferable principles from top-tier references

- Clear concept, not just pages of decoration
- Signature hero moment that immediately communicates the person and the specialty
- Editorial pacing and restraint in motion
- Use of bold typography, not generic card soup
- Strong content proof: role, outcomes, decisions, metrics, and evidence
- Performance under the hood without penalizing the visual language

### Gap table

| Dimension             | What top-tier work does              | What this portfolio does              | Gap    | Effort | Impact |
| --------------------- | ------------------------------------ | ------------------------------------- | ------ | ------ | ------ |
| Concept clarity       | One strong identity statement        | Polished but broad, less singular     | High   | Medium | 5      |
| Hero narrative        | Immediate role + proof + personality | Good but diluted by too many elements | High   | Small  | 5      |
| Content proof         | Case studies with metrics and depth  | Good, but not yet deep enough         | High   | Medium | 5      |
| Signature interaction | Distinct visual language             | Strong but familiar                   | Medium | Medium | 4      |
| Motion discipline     | Purposeful and restrained            | Good, but sometimes decorative        | Medium | Small  | 3      |
| Performance           | Fast and stable                      | Already strong                        | Low    | Small  | 2      |
| Accessibility         | Semantic and robust                  | Good baseline, but not perfect        | Medium | Small  | 4      |

### True limitations by bucket

Technical limitations:

- The site is performance-strong, but the 3D layer still needs stronger curation and more targeted use.
- There is still some room for cleaner lazy-loading and more deliberate component-level optimization.
- The site should avoid “everything is animated” behavior and instead choose fewer, higher-value moments.

Design limitations:

- Visual language lacks a distinct editorial point of view.
- The portfolio needs stronger hierarchy and less visual competition.
- The strongest design work is present in the dark hero and content framing, but it still needs a sharper identity.

Content limitations:

- Case studies need more proof, more numbers, and more specific outcomes.
- Role positioning needs to be more consistent and more credible.
- There should be a stronger “why this person” narrative across all sections.

Strategic limitations:

- The site still reads as “good execution” rather than “category-defining portfolio.”
- The project set is not yet framed as a singular point of view.

### What is already a strength worth protecting

- The dark cinematic palette and motion atmosphere are genuinely good.
- The build quality and performance are strong.
- The project data has enough substance to support a stronger narrative.
- The app has already crossed the line from generic template to competent custom portfolio.

### Stop doing

- Stop overloading the hero with too many labels and status signals.
- Stop using generic “AI / systems / architecture” language without proof.
- Stop treating the photo upload as a public-facing UI feature in the hero.
- Stop stacking decorative bits without a story payoff.
- Stop relying on generic tech tags without tangible outcomes.

---

## Phase 5: Report

### Verdict

Overall score: 74/100
Tier: Strong / Good, not award-winning yet
Delta vs baseline: +22 points over the 52/100 baseline
Awwwards-style estimate: ~74/100
Candid statement: This is now a strong portfolio, but it is not yet in the top-tier portfolio band. It has a polished visual system and good technical execution, but it still lacks a singular signature concept, stronger proof depth, and clearer strategic positioning. The route to award-level work is not a rebuild; it is a tightening of concept, narrative, and content proof.

### Scorecard (A-L)

| Area                                        | Score | Verdict                                                      |
| ------------------------------------------- | ----: | ------------------------------------------------------------ |
| A. Concept and art direction                |    72 | Good, not distinct enough for award-level memorability       |
| B. Visual craft                             |    76 | Strong and polished                                          |
| C. Motion design                            |    75 | Good but not signature                                       |
| D. 3D and graphics                          |    74 | Strong support layer, not yet the main idea                  |
| E. Interaction design                       |    78 | Good usability and tactile feeling                           |
| F. UX, IA, conversion                       |    77 | Clear and functional, but still generic in narrative payoff  |
| G. Content and storytelling                 |    60 | Biggest gap; needs deeper proof and sharper positioning      |
| H. Responsiveness and mobile                |    72 | Improved; still need stronger editorial discipline on mobile |
| I. Performance and technical excellence     |    85 | One of the site’s strongest dimensions                       |
| J. Accessibility and inclusivity            |    82 | Solid but not yet world-class                                |
| K. SEO and discoverability                  |    80 | Technically strong and discoverable                          |
| L. Reliability, security, and craft details |    78 | Stable and sound                                             |

### Top 10 limitations ranked by impact on world-class perception

1. Weak narrative specificity and positioning
2. Thin case-study depth and limited proof
3. Not yet a memorable signature concept
4. Over-designed hero clutter and visual competition
5. Generic luxury “AI systems” language without direct evidence in the right places
6. Inconsistent storytelling between role, platform, and value proposition
7. Too many decorative badges and labels instead of an editorial hierarchy
8. Limited differentiation from the “good portfolio template” lane
9. Mobile-first polish still needs tighter refinement for award-level quality
10. Need stronger credibility architecture around outcomes and process proof

### Top 10 priorities

1. Clarify and tighten personal positioning
   - Evidence: the portfolio currently mixes “graduate,” “engineer,” and “system architect” language in a way that weakens trust.
   - Why it matters: award-level portfolios feel unmistakably clear.
   - Fix: set one position statement, then repeat it in key places.
   - Effort: Small
   - Impact: 5

2. Rewrite the hero into a stronger thesis statement
   - Evidence: hero is visually strong, but not functionally a clear one-liner of value.
   - Fix: one clear line: “I build scalable product systems, AI workflows, and resilient web infrastructure.”
   - Effort: Small
   - Impact: 5

3. Deepen project proof with real case-study structure
   - Evidence: `src/data/portfolioData.ts` contains good project data, but the narrative should show problem, decision, trade-off, metric, and result.
   - Fix: add 3–5 paragraphs per flagship project with outcomes and validation.
   - Effort: Medium
   - Impact: 5

4. Cut hero clutter and identify the primary action
   - Evidence: the current hero is visually rich but competing with multiple badges and actions.
   - Fix: keep 1 main CTA, 1 secondary CTA, and 1 status object.
   - Effort: Small
   - Impact: 4

5. Choose one signature visual idea and commit to it
   - Evidence: the 3D scene is good, but not the site’s central identity yet.
   - Fix: define a single concept around motion, interaction, or system diagrams that clearly belongs to the portfolio.
   - Effort: Medium
   - Impact: 5

6. Reduce decorative excess in the project gallery
   - Evidence: repeated card treatments and extra labels crowd the page.
   - Fix: tighten the gallery to a clearer editorial rhythm.
   - Effort: Small
   - Impact: 4

7. Improve proof architecture for technical work
   - Evidence: the stack list is present, but the path from system architecture to outcomes is still not fully explicit.
   - Fix: add architecture diagrams, constraints, and measured outcomes where real.
   - Effort: Medium
   - Impact: 5

8. Strengthen CMS-like or personal admin UI removal from public interface
   - Evidence: photo upload controls appear in a public portfolio context.
   - Fix: move optional custom avatar logic into a hidden or dev-only area.
   - Effort: Small
   - Impact: 4

9. Tighten the mobile editorial flow
   - Evidence: current mobile layout is good but still lacks a decisive, premium reading rhythm.
   - Fix: reduce label density and create a more intentional vertical flow.
   - Effort: Small
   - Impact: 4

10. Raise content confidence with a tighter credibility filter
    - Evidence: a few phrases read like generic self-optimizing language instead of proof.
    - Fix: replace vague claims with measured, verifiable outcomes.
    - Effort: Small
    - Impact: 5

### Three signature idea options

#### Option 1: The “System Architecture as a Living Interface” concept

- Concept: the portfolio becomes a visual map of systems, with each project represented as a system diagram.
- Strengths: excellent for software engineer positioning.
- Interaction: project cards expand into architecture maps and trade-off callouts.
- Risk: can become overly technical or dense.
- Effort: Medium

#### Option 2: The “Code as Storyboard” concept

- Concept: the site uses a cinematic sequence of product moments, code snippets, and system diagrams as a story board.
- Strengths: works well for engineering + product identity.
- Interaction: scroll-driven narrative of systems and decisions.
- Risk: can overcomplicate if the story is not crisp.
- Effort: Medium

#### Option 3: The “Engineer in Motion” concept

- Concept: a slower, more editorial portfolio where one motion system drives the experience and the 3D layer supports the narrative.
- Strengths: fits the current aesthetic and keeps performance strong.
- Interaction: restrained hero and scroll choreography with clean content pacing.
- Risk: may feel too safe if not paired with a sharper story.
- Effort: Small-Medium

Recommended option: Option 1 or 2, depending on the desired positioning. The strongest choice is Option 1 if the portfolio’s strategic goal is to signal engineering depth and structured thinking.

### Content plan

- Write or deepen 3 flagship case studies: project problem, constraints, architecture, decisions, metrics, outcome.
- Remove or downgrade weakly supported claims and replace with proven metrics.
- Add one clear “How I work” section that explains process without sounding generic.
- Tighten tone: direct, technically credible, confident, not inflated.
- Keep a strong summary of technologies and outcomes, but front-load “what changed in the system” instead of “what stack I used.”

---

## Roadmap

### Phase A: Under 1 day

- Tighten hero positioning and remove excess clutter.
- Remove any public-facing admin/photo upload UI from the hero.
- Replace generic high-level copy with one sharp value statement.
- Verify the current hero message in desktop and mobile.

Acceptance: hero communicates a single role and value proposition in under 5 seconds.

### Phase B: 1–3 days

- Rewrite project case studies with proof-driven structure.
- Add one “Selected Work” proof architecture per flagship project.
- Simplify the project gallery card hierarchy.
- Improve the mobile flow and reduce clutter.

Acceptance: each flagship project has problem, role, architecture, and outcome.

### Phase C: 1–2 weeks

- Create a stronger signature interaction concept.
- Refine the visual system to a more editorial and less generic rhythm.
- Build a more opinionated content architecture and stronger social proof layout.
- Improve semantic accessibility and keyboard flow.

Acceptance: the site reads as a designed portfolio ecosystem, not a generic landing page.

### Phase D: Signature work

- Build a single distinctive portfolio narrative around one idea: system thinking, AI product design, or engineering storytelling.
- Replace generic visual repetition with an edited, memorable experience.

Acceptance: a viewer can remember the portfolio after 10 minutes, not just the style.

### KPI dashboard

| Metric                         |     Current |        Target |
| ------------------------------ | ----------: | ------------: |
| Lighthouse mobile Performance  |          99 |           90+ |
| Lighthouse desktop Performance |          99 |           90+ |
| Accessibility                  |         100 |           100 |
| SEO                            |         100 |           100 |
| LCP                            |        0.7s |         <2.0s |
| CLS                            |         0.0 |         <0.02 |
| INP / FID                      |       150ms |        <150ms |
| Console errors                 |           0 |             0 |
| 60 FPS mid-range mobile        | likely good | steady 60 FPS |

### Submission readiness checklist for Awwwards/CSSDA/FWA

- Strong hero concept and clear positioning: not yet fully decisive
- Deep case-study proof: still incomplete
- Signature interaction idea: partially present, not fully developed
- Editorial polish: good, but still one step from iconic
- Content confidence: not yet strong enough to stand against top winners

Honest view: not ready to submit as a top-tier award category portfolio now. It is strong enough to be taken seriously, but it still needs a more singular point of view before it can compete with award-winning developer portfolios.

---

## Appendix

### Evidence index

- Production build: current `npm run build` output in this workspace
- Local preview: `http://localhost:4173/`
- Main entry and hero: `src/App.tsx`, `src/views/HomeView.tsx`
- Data layer: `src/data/portfolioData.ts`
- 3D and scene layer: `src/components/BackgroundScene.tsx`, `src/components/TechCanvas3D.tsx`
- Asset pipeline: `scripts/build-portrait.mjs`, `src/data/portraitManifest.ts`
- Audit data: `/audit/lighthouse.json`

### Unverified items

- Some external social/profile links and project live URLs remain unverified end-to-end in a fully automated browser crawl.
- Some project claim numbers or deployment outcomes may need a final content-validation pass against actual production data.

How to verify:

- Open each live link in a fresh browser session.
- Confirm the live site and claim text match the portfolio statement.
- Validate each case study against current public code or deployment states.

### Manual real-device checklist

- iPhone Safari
- Mid-range Android Chrome
- Small tablet breakpoint
- Low-power mode
- Slow 3G / throttled mobile network
- Reduced motion enabled
- Keyboard-only navigation
- 200% browser zoom

## Final note

The portfolio is now much stronger than the 52/100 baseline. It is proving itself as a technologically competent and visually polished portfolio, but it is still not at the world-class award tier because the narrative and case-study proof need to be deeper and more distinctive. The next step is not a heavy rebuild — it is strategic tightening, not a total rework.

### Phase summaries

- Phase 0: strong technical foundation, but not yet a distinctive concept.
- Phase 1: measured build and Lighthouse are good; current portfolio is in the “good/strong” band, not the award band.
- Phase 2: major value is in content proof and narrative clarity, not in raw visual execution.
- Phase 3: the site is understandable quickly, but not yet memorable or deeply trust-building.
- Phase 4: award-level distance is mainly strategic and editorial, not technical.
- Phase 5: verdict is “strong portfolio, not yet world-class.”

### Final verdict in one line

Good technical polish and strong visuals, but still not top-tier award-winning developer portfolio material until the site gains one clearer identity, deeper proof, and more editorial confidence.

---

## Appendix: Remediation Status (Engineering-Hygiene Pass)

*Appended after implementation. The audit text above is preserved exactly as originally written; this appendix records which recommendations have since been verified against the current code.*

### "Stop doing" checklist — current status

| Recommendation | Status | Verification |
| --- | --- | --- |
| Stop overloading the hero with too many labels and status signals | **Done** | Hero reduced to one availability badge, plain-text location, functional social links, one primary CTA, one secondary CTA. |
| Stop using generic "AI / systems / architecture" language without proof | **Partially done** | The identity-level language is now one canonical string across title, meta, and JSON-LD. Unverified service/scale phrasing still survives in page-scoped descriptions and project metrics — see the claim blocker below. |
| Stop treating the photo upload as a public-facing UI feature in the hero | **Done** | `src/components/ImageUploadModal.tsx` deleted and all upload plumbing removed; no upload chunk in `dist/`. |
| Stop stacking decorative bits without a story payoff | **Addressed** | Hero badge/CTA duplication removed. Badge use elsewhere was deliberately retained where it is load-bearing (contact action pills, featured-project status, specialized-module tech chips — those cards have no click handler, so the chips are the only place the stack is surfaced). |
| Stop relying on generic tech tags without tangible outcomes | **Open** | This is a content problem, not a code problem. `CONTENT_INTAKE.md` remains blank because no replacement outcomes have been supplied or approved. |

### Phase 2 — Content and storytelling (originally 60/100)

The specific defects behind this score that were verifiable in code are now closed: the contradictory persona, the `SYSTEMS ARCHITECT` kicker, the `99.9% Uptime` / `97 PG Tables` claims, the `99.9%`-style telemetry row in the hero, and the `Next.js 16` inaccuracy. The score cannot honestly be raised on that basis alone, because the report's main objection — that the case studies are product summaries rather than proof-driven narratives — is untouched and depends on new written content.

A discovery worth recording: the `/#dev-motion` and `/#dev-ui` showcase routes are **not** gated behind `import.meta.env.DEV`. `src/App.tsx` activates them from URL hash, query, and path segments, so they ship in the production bundle and are publicly reachable. They were therefore treated as content surfaces. Both had to be corrected — the motion showcase still carried the original "Ambition-driven Computer Science graduate… high-concurrency microservices" persona copy, which meant the exact wording criticized in Phase 2 was still live on the deployed site.

### Phase 3 — 5-second hero test

Signal duplication is resolved. The 5-second test itself was not re-run as a formal timed study in this pass, so this is an implementation-level resolution rather than a re-measured result.

### Final note

The verdict "strong portfolio, not yet world-class" is unchanged, and the report's central thesis is confirmed: the remaining distance is editorial, not engineering. Nothing in this pass made the site faster or more distinctive; it removed contradictions between what the site claims and what it can prove.

### Outstanding content blocker

The following remain in `src/data/portfolioData.ts` without supporting evidence in this repository, and they contradict the report's own "stop using language without proof" standard:

- Endpoint, schema-table, test, and workflow counts (`79 Endpoints`, `20+ Endpoints`, `schemaTablesCount: 97`, `97 PyTest passing suite`, `19 Passing Tests`, `7 Workflows`).
- Performance and outcome figures (`-50% Support Load`, `+23.5% Metric Boost`, Lighthouse `64 → 91 (+27)` / `-30% latency`).
- `BanglaBERT` scaling claims.
- The `KPI dashboard` above cites Lighthouse 99/100/100/100 from `audit/lighthouse.json`; the public-facing `64 → 91` improvement claim is a **different** measurement and is not supported by any committed artifact.

They are enumerated in `CLAIMS_LEDGER.md` and need owner-supplied evidence or an explicit retention decision. Note also the internal inconsistency this exposes: Project 01 and Project 03 express `testCoverage` qualitatively, while Project 02 states `97 PyTest passing suite` numerically.
