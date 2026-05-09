# Architecture - Lumina

## Current App Structure

Lumina is currently a React application with most business logic kept in small service modules. The app already supports the full path from landing page to audit form to results page.

## Flow

```text
Landing Page
  -> Audit Form
  -> Validation
  -> Audit Service
  -> Summary Service
  -> Results Page
  -> Lead Capture
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
- `validators.js`: validates audit form input

## Current Limitations

- No backend yet
- No database persistence yet
- No email delivery yet
- No shareable URL system yet

## Likely Next Steps

1. Move saved audit details into Supabase
2. Add shareable audit URLs
3. Add email delivery for saved summaries
4. Add API routes for summary generation and lead storage
