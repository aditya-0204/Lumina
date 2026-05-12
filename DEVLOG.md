# DEVLOG - Lumina Development

## Day 1 - May 7, 2026

**Hours worked:** 3

**What I did:**
- Initialized React + Vite project with Tailwind CSS
- Set up package.json, linting, testing, and CI workflow
- Built the landing page and basic app shell
- Created the initial project structure and supporting docs

**What I learned:**
- Vite keeps frontend iteration much faster than CRA for this kind of build sprint
- A service-module structure makes it easier to grow business logic without bloating React components

**Blockers:**
- None

**Plan for next day:**
- Build the full audit input flow and pricing structure

---

## Day 2 - May 8, 2026

**Hours worked:** 4

**What I did:**
- Built the multi-tool audit form for 8 AI tools
- Added per-tool plan, spend, and seats inputs
- Added team size and use case selection
- Implemented localStorage persistence for form progress
- Created centralized pricing constants and validation logic
- Added lint/test/build fixes so the repo validates cleanly

**What I learned:**
- Persisted form state greatly improves UX for longer audit forms
- Pricing data is easier to maintain when separated from calculation logic

**Blockers:**
- GitHub Actions initially failed because the repo was not tracking the lockfile needed by `npm ci`

**Plan for next day:**
- Implement the actual audit engine and a real results page

---

## Day 3 - May 9, 2026

**Hours worked:** 5

**What I did:**
- Built the audit engine to calculate current spend, recommended spend, and savings
- Added same-vendor plan-fit recommendations
- Added cross-vendor recommendation logic for selected use cases
- Replaced the temporary results page with a full breakdown screen
- Added audit-engine tests and verified lint, tests, and build

**What I learned:**
- Recommendation logic gets clearer when each candidate path is normalized into the same shape before ranking
- The results page is much easier to reason about when totals and per-tool recommendations are separated visually

**Blockers:**
- A test case initially assumed the cross-vendor recommendation would always win, but the actual ranking logic correctly preferred the highest-savings candidate

**Plan for next day:**
- Add summary generation and lead capture

---

## Day 4 - May 9, 2026

**Hours worked:** 3

**What I did:**
- Added an async summary-generation flow to the results experience
- Added a short summary service for the results screen
- Added lead capture UI with email validation and honeypot field
- Added local lead persistence for the save flow
- Added tests for summary and lead-capture services

**What I learned:**
- Keeping the summary logic separate makes the audit calculations easier to maintain
- Lead capture is smoother when shown after value is delivered rather than before the audit

**Blockers:**
- Supabase and transactional email are still pending, so the current implementation stores lead data locally only

**Plan for next day:**
- Add share links and keep expanding test coverage

---

## Day 5 - May 10, 2026

**Hours worked:** 3

**What I did:**
- Added a share service for saving PII-safe audit snapshots
- Added share-link creation from the results page
- Added URL-based shared audit loading in the app shell
- Added tests for the share service
- Re-ran lint, tests, and production build after the share flow changes

**What I learned:**
- Keeping shared snapshots separate from lead data makes it easier to control what is safe to expose
- URL-driven state is simple to add when the shared payload is already normalized

**Blockers:**
- Shared audits still live in browser storage, so links are only durable on the same machine until backend persistence is added

**Plan for next day:**
- Improve the public-facing experience and keep the project ready for deployment

---

## Day 6 - May 12, 2026

**Hours worked:** 3

**What I did:**
- Updated app metadata for the Lumina name and current product description
- Refined the visual system with stronger typography and background treatment
- Rebuilt the landing page with a clearer hero, sample snapshot, and stronger explanation of the product flow
- Cleaned the results page presentation and fixed lingering text rendering issues
- Re-ran lint, tests, and production build after the polish pass

**What I learned:**
- The first screen needs to communicate trust and clarity immediately, especially for a finance-oriented tool
- Metadata and naming consistency matter because small leftover details can make the product feel unfinished

**Blockers:**
- Deployment has not been configured yet, so the app is polished but not published

**Plan for next day:**
- Finalize deployment prep, run a last documentation pass, and do submission cleanup

---

## Day 7 - To be filled
