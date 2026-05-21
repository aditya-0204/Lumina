## What this PR does
This PR adds a re-audit workflow on top of the existing Lumina audit flow. Completed audits are now stored with the user email, original input, computed output, and the exact pricing snapshot used at the time of generation. When pricing changes later, a manual detection endpoint can find affected audits, send one consolidated email per user, and link directly into a side-by-side re-audit diff view.

## Why
The Round 1 product was useful for a point-in-time savings check, but it could go stale as vendor pricing moved. That is risky because an old recommendation can become misleading. I assumed the core user is a startup operator or engineering lead who wants a lightweight audit now and a low-effort way to revisit it later without rebuilding the same stack input from scratch.

## How it works
The core change is that the audit engine can now run against an injected pricing catalog instead of only the current in-repo pricing constant.

- `src/services/auditService.js` now supports rerunning the same audit against a historical or current pricing catalog.
- `src/services/reauditService.js` builds pricing snapshots, reruns stored audits, and compares old vs new results.
- `api/audits.js` stores a completed audit as soon as results are generated.
- `api/leads.js` now upserts the same audit record shape when the user saves the result from the results page.
- `api/detect-changes.js` scans stored audits, reruns them against current pricing, groups affected audits by email, and sends one consolidated re-audit email per user.
- `api/reaudit.js` returns the original audit, a fresh rerun, and a computed diff for the frontend.
- `src/components/ReauditDiffView.jsx` renders the old and new recommendations side by side with savings deltas and per-tool diffs.

Flow:

```text
AuditForm -> calculateAudit -> /api/audits
                       |
                       v
                 audits table

pricing.js changes -> POST /api/detect-changes
                           |
                           v
                rerun stored audits -> compare diffs
                           |
                           v
                one email per user with ?reaudit=audit_id
                           |
                           v
                    /api/reaudit?id=audit_id
                           |
                           v
                    ReauditDiffView
```

## What I cut
- I kept pricing change detection as a manual `POST /api/detect-changes` endpoint instead of adding cron first. That removed deployment and plan-tier risk and still satisfies the requirement.
- I did not add unsubscribe links. In a 36-hour window, I prioritized end-to-end storage, detection, email, and diff visibility first.
- I did not build a public “what changed this week” page. The internal detection logic is there, but reviewer-visible value was higher in the user re-audit flow.
- I did not build an admin dashboard for totals or click-through rate. That would have added more schema, analytics, and UI than the core feature needed.
- I kept pricing updates as a documented file-edit-and-redeploy flow instead of introducing a separate admin CMS surface.

## How to test it manually
1. Apply the updated `supabase/schema.sql` to your Supabase project.
2. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`.
3. Run the app and submit an audit from the main form with a real email address. The email field is now part of the audit form because the completed audit is stored immediately.
4. Confirm that a row appears in `audits` with `id`, `email`, `input_stack`, `output_result`, and `pricing_snapshot`.
5. Create a share link from the results page. The public URL now uses the same audit id as the stored audit.
6. Edit `src/constants/pricing.js`. For example, change `cursor.Pro.monthly` from `20` to `30`, then redeploy or restart locally.
7. Trigger `POST /api/detect-changes`.
8. Check the response body. It should report scanned audits, changed audits, and grouped email results.
9. Check the inbox for the saved email address. You should receive one consolidated re-audit email for all affected audits tied to that user.
10. Click the re-audit link in the email. The app should open `?reaudit=<audit_id>` and show the original audit vs the current rerun side by side, with the total savings delta as the headline and per-tool diffs below it.

## What's tested
- Audit calculations still work for same-vendor and cross-vendor recommendations.
- Audit calculations can be rerun against a supplied pricing snapshot.
- Pricing metadata helpers can resolve values from cloned snapshots.
- Re-audit comparison logic detects recommendation and savings deltas.
- Audit form validation now requires a valid work email in addition to the Round 1 fields.
- Existing local lead capture and share behavior tests still pass.

## Open questions / risks
- `POST /api/detect-changes` is manual right now. If this shipped broadly, I would want a scheduler plus request authentication before exposing it publicly.
- Pricing snapshots are stored as JSON copied from the in-repo catalog. If the catalog grows significantly, I would revisit how versions are identified and deduplicated.
- Email delivery is only as reliable as the configured sender domain and Resend account setup. The app logs the notification record even without a live provider, but that does not prove inbox placement.
