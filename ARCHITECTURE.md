# Architecture - Lumina

## Current App Structure

Lumina is currently a React application with most business logic kept in small service modules. The app supports the full path from landing page to audit form to results page, plus saved leads, shareable audit snapshots, and a more polished public-facing landing experience.

## Flow

```text
Landing Page
  -> Audit Form
  -> Validation
  -> Audit Service
  -> Summary Service
  -> Results Page
  -> Lead Capture
  -> Share Link Creation
  -> Shared Audit View
```

## Main Modules

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
```

## Responsibilities

- `auditService.js`: computes spend totals, savings, and recommendations
- `pricingService.js`: provides pricing lookups and plan metadata
- `summaryService.js`: builds the short summary shown on the results page
- `leadCaptureService.js`: validates and stores saved audit details
- `shareService.js`: saves a PII-safe audit snapshot and resolves shared audits by ID
- `validators.js`: validates audit form input

## Current Limitations

- No backend yet
- No database persistence yet
- No email delivery yet
- Share links work through browser storage only, not server persistence
- Metadata and landing polish are improved, but deployment-specific monitoring is not added yet

## Likely Next Steps

1. Move saved audit details into Supabase
2. Persist shared audits outside the browser
3. Add email delivery for saved summaries
4. Add API routes for summary generation, lead storage, and share retrieval
5. Add deployment configuration and post-deploy smoke checks
