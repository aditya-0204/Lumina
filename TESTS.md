# TESTS.md - Current Coverage

All tests run with:

```bash
npm run test -- --run
```

## Current Test Files

### `src/services/auditService.test.js`
Covers:
- plan-fit recommendation logic
- cross-vendor switch logic
- keep-current scenarios when no cheaper practical option exists

### `src/services/pricingService.test.js`
Covers:
- monthly pricing lookups
- pricing metadata access
- per-user plan detection

### `src/services/summaryService.test.js`
Covers:
- summary construction
- async summary response shape

### `src/services/leadCaptureService.test.js`
Covers:
- lead-form validation
- payload construction with audit context
- localStorage persistence behavior

### `src/utils/validators.test.js`
Covers:
- required audit form fields
- valid form acceptance
- invalid spend and seat handling

## Current Coverage Notes

- Core service logic for pricing, audit, summary, lead capture, and validation is covered
- UI component rendering tests are not added yet
- Shareable URL logic is not implemented yet, so no share-service tests exist yet
- Future Supabase integration will need API-layer or integration tests

## Recommended Next Tests

1. Component tests for `AuditForm.jsx`
2. Component tests for `AuditResults.jsx`
3. Share-service tests once shareable URLs exist
4. Integration tests for Supabase-backed lead persistence
