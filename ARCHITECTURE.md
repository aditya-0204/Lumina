# Architecture - Lumina

## System Diagram

```text
Browser
  |
  | 1. user submits audit form
  v
React App (Vite)
  |
  |-- AuditForm.jsx
  |-- AuditResults.jsx
  |-- auditService.js
  |-- pricingService.js
  |-- summaryService.js
  |-- leadCaptureService.js
  |-- shareService.js
  |
  | 2. summary request
  v
/api/summary
  |
  |-- Anthropic API if key exists
  |-- local template fallback if key is missing or request fails
  |
  | 3. lead capture request
  v
/api/leads
  |
  |-- Supabase `audits` table if configured
  |-- Supabase `leads` table if configured
  |-- Resend email if configured
  |-- browser storage fallback on the client if not configured
  |
  | 4. share request
  v
/api/share
  |
  |-- Supabase `shared_audits` table if configured
  |-- browser storage fallback on the client if not configured
```

## Data Flow

1. The user fills in the audit form with tools, plans, monthly spend, seat count, team size, and primary use case.
2. `auditService.js` converts that input into current spend, recommended spend, monthly savings, annual savings, and a ranked tool-by-tool breakdown.
3. `summaryService.js` calls `/api/summary`. If an Anthropic key is present, the route sends a prompt to Anthropic. If not, Lumina falls back to a deterministic local summary so the app remains usable.
4. The results page renders hero totals, recommendations, a high-savings or low-savings CTA, lead capture, share actions, and a print-friendly PDF view.
5. When the user saves the audit, `leadCaptureService.js` posts the lead and audit payload to `/api/leads`. The route is prepared to store the audit and lead in Supabase and send an email through Resend.
6. When the user shares the audit, `shareService.js` posts a PII-safe payload to `/api/share`. If backend storage is not available, the client falls back to local browser storage.

## Why This Stack

- React + Vite: fast local iteration, simple deploy story, and enough structure for a single-page workflow.
- Tailwind CSS: quick systemization of spacing, typography, and responsive layout without a heavy component library.
- Service modules: easy to test and easier to reason about than large stateful components.
- Vercel-style serverless routes: enough backend surface area for Anthropic, Supabase, and Resend without adding a separate Express deployment.
- Supabase REST: straightforward database integration using environment variables and a small schema.

## Current Modules

```text
src/
  components/
    AuditForm.jsx
    AuditResults.jsx
  pages/
    LandingPage.jsx
  services/
    auditService.js
    pricingService.js
    summaryService.js
    leadCaptureService.js
    shareService.js
  constants/
    pricing.js
    tools.js
  utils/
    validators.js

api/
  summary.js
  leads.js
  share.js
  _lib/
    http.js
    integrations.js
    rateLimit.js
    summaryPrompt.js
```

## 10k Daily Audits: What Would Change

If Lumina needed to handle roughly 10,000 audits per day, the core recommendation logic would still be fine because the audit computation is lightweight. The main changes would be around persistence, observability, and caching.

1. Move all share storage and lead storage to live Supabase tables immediately.
2. Add request logging, structured error tracking, and analytics around completion, lead capture, and share creation.
3. Cache common summary patterns or use a queue for LLM summarization if volume makes synchronous generation expensive.
4. Add stronger server-side rate limiting than the current in-memory instance guard.
5. Add a proper OG image generation path for shared results if public sharing becomes common.
