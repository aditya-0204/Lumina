# Lumina

Lumina is an AI spend audit tool for startup and engineering teams that want a fast read on whether they are overpaying for tools like ChatGPT, Claude, Copilot, Cursor, Gemini, and Windsurf. The app collects a team's current stack, estimates cheaper practical alternatives, generates a short executive summary, and produces a shareable result that can be saved or reviewed later.

The current repository includes the full product flow, API route scaffolding for AI summary generation and backend persistence, a PDF-friendly results page, automated tests, and deployment configuration. External keys and a live hosting account are still required to turn the prepared API integrations into live database, email, and LLM-backed behavior.

## Deployed URL

Pending deployment. The repo is ready for Vercel or Netlify, but a live URL still needs to be created from an external hosting account.

## Screenshots / Recording

Add these before submission:

1. Landing page hero and feature section
2. Audit form with at least two tools filled in
3. Results page with savings totals and per-tool recommendations
4. Optional: a 30-second walkthrough recording after deployment

## Quick Start

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Environment Variables

Copy `.env.example` and set the values you have available:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

## What The App Does

1. Captures the current AI stack, team size, monthly spend, seats, and use case
2. Calculates current monthly and annual spend
3. Recommends cheaper plans or practical cross-vendor alternatives
4. Highlights large-savings and low-savings cases differently
5. Generates an executive summary through `/api/summary` with a deterministic fallback
6. Saves lead details through `/api/leads` with a browser fallback
7. Creates shareable audit links through `/api/share` with a browser fallback
8. Lets the user print the results page as a PDF brief

## Stack

- React 18
- Vite
- Tailwind CSS
- Service-module business logic in `src/services`
- Vercel-style serverless routes in `api/`
- Supabase REST integration for persistence
- Resend REST integration for email

## Decisions

1. JavaScript over TypeScript: the repo already had JavaScript momentum on Day 1, and staying in JS kept the seven-day build focused on shipping the product flow instead of spending time on type migration. The service boundaries are small enough that tests and separation-of-concerns still provide safety.
2. Hardcoded pricing and audit rules over fully dynamic vendor ingestion: for an assignment-sized build, explicit pricing constants were easier to defend, test, and document than a scraping-heavy or constantly refreshed data pipeline.
3. Service modules over colocating logic inside React components: recommendation logic, lead capture, summary generation, and sharing each live in separate modules so the UI stays readable and the tests can target business rules directly.
4. Serverless route scaffolding over a custom backend server: Vercel-style API routes are enough for Anthropic, Supabase, and Resend integration without introducing a separate Node deployment footprint.
5. Fallback-first UX over hard failure: when LLM, database, or share persistence keys are missing, Lumina still works locally so the product can be demonstrated and tested while infrastructure is being connected.

## Key Files

- `src/components/AuditForm.jsx`
- `src/components/AuditResults.jsx`
- `src/services/auditService.js`
- `src/services/summaryService.js`
- `src/services/leadCaptureService.js`
- `src/services/shareService.js`
- `api/summary.js`
- `api/leads.js`
- `api/share.js`
- `supabase/schema.sql`

## Related Docs

- `ARCHITECTURE.md`
- `DEPLOYMENT.md`
- `DEVLOG.md`
- `PROMPTS.md`
- `TESTS.md`
- `SUBMISSION_CHECKLIST.md`
