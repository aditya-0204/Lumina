# TESTS.md

Run the automated suite with:

```bash
npm run test -- --run
```

## Automated Test Files

### `src/services/auditService.test.js`

This file contains the assignment's required audit-engine coverage. Current cases:

1. Recommends lower-fit plans for small teams
2. Suggests a cross-vendor alternative for coding workflows
3. Keeps the current tool when there is no cheaper practical option
4. Aggregates monthly and annual savings across multiple tools
5. Sorts the biggest savings opportunities first

### `src/services/pricingService.test.js`

Covers:

- monthly pricing lookup
- annual pricing lookup behavior
- per-user plan detection

### `src/services/summaryService.test.js`

Covers:

- fallback summary content generation
- async summary response shape

### `src/services/leadCaptureService.test.js`

Covers:

- email validation
- honeypot validation
- payload construction
- local browser persistence fallback

### `src/services/shareService.test.js`

Covers:

- PII-safe shared audit storage
- shared audit retrieval
- share URL creation

### `src/utils/validators.test.js`

Covers:

- required field validation
- positive spend and seat validation
- valid form acceptance

## Notes

- The most important assignment requirement was a minimum of 5 audit-engine tests, and that requirement is now satisfied in `src/services/auditService.test.js`.
- The current suite is service-layer focused because the main risk in this project is recommendation correctness rather than component rendering details.
- When the live Supabase and email integrations are connected, API integration tests should be the next addition.
