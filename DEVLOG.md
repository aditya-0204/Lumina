# DEVLOG - Lumina

## Day 1 -- 2026-05-07

**Hours worked:** 3

**What I did:**
- Initialized the React + Vite project and added Tailwind
- Set up linting, testing, CI, and the initial repo structure
- Built the landing page and basic routing flow into the audit experience
- Created the first documentation files required by the assignment

**What I learned:**
- Vite is a better fit than CRA for a short sprint because iteration is much faster
- Splitting business logic into small services early makes later changes much safer

**Blockers / what I'm stuck on:**
- None on Day 1

## Day 2 -- 2026-05-08

**Hours worked:** 4

**What I did:**
- Built the audit form for 8 tools with plan, spend, and seat inputs
- Added team size and use case fields
- Added local persistence so the form survives page refreshes
- Centralized pricing constants and validation logic
- Fixed the GitHub Actions lockfile issue so local and CI installs match

**What I learned:**
- Long forms feel much safer when users can refresh without losing progress
- Keeping pricing in constants instead of inline UI code makes the audit engine easier to evolve

**Blockers / what I'm stuck on:**
- GitHub Actions was failing until `package-lock.json` was tracked properly

## Day 3 -- 2026-05-09

**Hours worked:** 5

**What I did:**
- Implemented the audit engine for current spend, savings, and recommendations
- Added same-vendor plan-fit logic
- Added cross-vendor alternatives for several use cases
- Built the results page with totals and a per-tool breakdown
- Added the first audit-engine tests

**What I learned:**
- Recommendation logic is easier to debug when every candidate recommendation uses the same shape before sorting
- The results page benefits from separating high-level totals from tool-level reasoning

**Blockers / what I'm stuck on:**
- Test expectations initially assumed a different recommendation winner than the pricing logic actually produced

## Day 4 -- 2026-05-10

**Hours worked:** 4

**What I did:**
- Added executive summary generation on top of the audit output
- Added lead capture with email validation and a honeypot field
- Added local lead persistence as a temporary fallback
- Added tests for summary and lead-capture behavior

**What I learned:**
- It is easier to keep the audit engine trustworthy if the written summary is generated after the numeric recommendation pass
- Capturing leads after showing value feels better than forcing a gate before the results

**Blockers / what I'm stuck on:**
- Real database and email delivery were still pending, so the flow had to start with local fallbacks

## Day 5 -- 2026-05-11

**Hours worked:** 4

**What I did:**
- Added shareable audit links with PII stripped from the shared payload
- Added shared-audit loading by URL
- Added share-service tests
- Expanded the audit-engine test suite to five cases

**What I learned:**
- Shared payloads should be normalized separately from lead records so it is obvious what can be public
- URL-based state is simple to support once the payload is already stable

**Blockers / what I'm stuck on:**
- Browser-only sharing works for demos but not for a real public multi-device share flow

## Day 6 -- 2026-05-12

**Hours worked:** 4

**What I did:**
- Polished the landing page and metadata
- Improved the results-page presentation
- Added a PDF-friendly print flow
- Prepared deployment configuration for Vercel and Netlify
- Cleaned the docs so the repo reads more like a finished submission

**What I learned:**
- Finance-oriented products need clarity and trust on the first screen, not just feature completeness
- A print-friendly export is a useful shortcut for teams that want to share results internally

**Blockers / what I'm stuck on:**
- Public deployment still depends on an external hosting account

## Day 7 -- 2026-05-13

**Hours worked:** 5

**What I did:**
- Added serverless route scaffolding for Anthropic summaries, Supabase storage, and Resend email
- Added a Supabase schema file and environment example
- Updated the results experience for high-savings and low-savings cases
- Tightened CI by making lint failures block the workflow
- Finished the remaining assignment docs and submission support files

**What I learned:**
- The repo can be made substantially more complete without overcomplicating the frontend if backend integration points are cleanly isolated
- “Done” for a project like this is mostly about reducing ambiguity: docs, tests, environments, and failure behavior all matter

**Blockers / what I'm stuck on:**
- Live database writes, LLM responses, email delivery, screenshots, and a public URL still require external keys or hosting-account actions outside this local repo
