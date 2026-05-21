## 2026-05-20 13:55 - Start
Read the Round 2 brief carefully and compared it against the existing Round 1 codebase before changing anything.

## 2026-05-20 14:10 - Mapped the base architecture
Confirmed the current app already had a usable audit engine, Supabase schema, lead capture route, and share route. The biggest missing piece was replayability because pricing was hardcoded and audits were not stored with a pricing snapshot.

## 2026-05-20 14:25 - Decided on approach
Staying on the same React + Vite + serverless route stack. Manual trigger endpoint for detection instead of cron. Supabase remains the storage layer. Resend remains the email provider.

## 2026-05-20 14:30 - Refactored pricing injection
Updated pricing and audit services so the audit engine can run against either current pricing or a stored snapshot. Added tests for injected pricing catalogs.

## 2026-05-20 14:45 - Added re-audit service layer
Created shared helpers for pricing snapshot cloning, stored-audit normalization, reruns, and result diffs. This made the server routes and frontend diff logic much simpler.

## 2026-05-20 15:00 - Fixed persistence shape
Extended the Supabase schema and changed backend storage so audits can hold `email`, `input_stack`, `output_result`, `pricing_snapshot`, and `shared_payload`.

## 2026-05-20 15:15 - Hit a requirements mismatch
Noticed that Round 2 says every completed audit should be stored with the user email. In Round 1 the email only appeared after results. I changed the intake flow to require work email before audit generation and added automatic persistence on completion.

## 2026-05-20 15:35 - Added detection and re-audit routes
Built `POST /api/detect-changes`, `GET /api/audit`, and `GET /api/reaudit`. Detection groups changed audits by email and records one notification row per pricing version.

## 2026-05-20 15:55 - Built the diff UI
Added a dedicated side-by-side re-audit view with savings delta first, pricing changes in the middle, and tool-level diffs below.

## 2026-05-20 16:10 - Corrected share id behavior
Caught that the share URL used a separate generated id, while the brief wanted the audit id to line up with the public URL identity. Changed share persistence to use the audit id itself.

## 2026-05-20 16:20 - Verification pass
Ran the full test suite and a production build. Everything green.

## 2026-05-20 16:35 - Writing reviewer docs
Documenting the exact manual flow, trade-offs, and risks while the implementation details are fresh.
