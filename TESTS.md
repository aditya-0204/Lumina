# TESTS.md - Test Coverage

All tests are located in `src/__tests__/` and run with `npm test`.

## Test Suite Overview

### 1. auditEngine.test.js
**What it covers:** Core audit calculation logic
**Tests:**
- ✓ Correctly calculates annual spend from monthly spend
- ✓ Identifies overspend on wrong plan (e.g., Team for 2 users)
- ✓ Suggests cheaper same-vendor alternative
- ✓ Recommends cross-vendor alternative when significantly cheaper
- ✓ Handles mixed tool stacks and aggregates savings

**How to run:**
```bash
npm test auditEngine.test.js
```

### 2. pricingService.test.js
**What it covers:** Pricing lookup and data accuracy
**Tests:**
- ✓ Returns correct pricing for all tools and plans
- ✓ Handles API pricing tiers correctly
- ✓ Edge case: pricing for tools not in database returns error
- ✓ Pricing data is current

**How to run:**
```bash
npm test pricingService.test.js
```

### 3. summaryService.test.js
**What it covers:** LLM summary generation with fallbacks
**Tests:**
- ✓ Generates personalized summary on success
- ✓ Handles API timeout gracefully with template fallback
- ✓ Prompt construction is correct format
- ✓ Summary length constraints (100 words)

**How to run:**
```bash
npm test summaryService.test.js
```

### 4. validators.test.js
**What it covers:** Input validation
**Tests:**
- ✓ Rejects invalid tool names
- ✓ Validates team size is positive number
- ✓ Validates use case is one of enum values
- ✓ Accepts valid audit form input

**How to run:**
```bash
npm test validators.test.js
```

### 5. shareService.test.js
**What it covers:** Shareable URL generation and retrieval
**Tests:**
- ✓ Generates unique ID for audit
- ✓ Strips PII (email, company name) from shared version
- ✓ Retrieves shared audit by ID
- ✓ Shared URL omits sensitive data

**How to run:**
```bash
npm test shareService.test.js
```

## Run All Tests
```bash
npm test                    # Watch mode
npm test -- --run           # Single run
npm test -- --coverage      # With coverage report
```

## Test Standards
- Minimum 80% coverage for services/
- 100% coverage for critical path (audit engine)
- No skipped tests
- All tests must run in CI/CD pipeline

