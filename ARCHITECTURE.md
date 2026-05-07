# Architecture - SpendAudit

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  Landing Page → Audit Form → Results Page → Shareable URL  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON
┌────────────────────▼────────────────────────────────────────┐
│                  Backend (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────┤
│  Routes:                                                     │
│  • POST /api/audit - Calculate audit                        │
│  • GET /api/result/:id - Fetch shared result                │
│  • POST /api/leads - Store email + metadata                 │
│  • POST /api/summary - Generate AI summary                  │
└────────────────┬─────────────────────┬──────────────────────┘
                 │                     │
        ┌────────▼─────────┐    ┌──────▼─────────┐
        │ Supabase DB      │    │ Anthropic API  │
        │ • audits         │    │ (LLM Summary)  │
        │ • leads          │    │                │
        │ • shared_urls    │    └────────────────┘
        └──────────────────┘
```

## Data Flow: From Input → Results

```
User Input (Tools, spend, team size)
    ↓
Form Validation (Client-side)
    ↓
POST /api/audit { tools[], teamSize, useCase }
    ↓
Backend: Audit Engine Service
    ├─ Load pricing database
    ├─ For each tool:
    │  ├─ Calculate current annual spend
    │  ├─ Evaluate plan fit for team size
    │  ├─ Find cheaper plan alternatives
    │  └─ Identify tool alternatives
    ├─ Calculate total savings
    └─ Return audit results
    ↓
POST /api/summary { auditResults }
    ↓
Anthropic API: Generate personalized summary
    ↓
DB: Store audit + Create shareable URL
    ↓
Response: auditId + results + summary + shareUrl
    ↓
Frontend: Render Results Page
    ↓
User can email or share
```

## Backend Service Architecture

Following service module pattern for clean separation of concerns:

```
services/
├── auditService.js        # Core audit calculation logic
├── pricingService.js      # Pricing data & lookup
├── summaryService.js      # LLM integration
├── leadService.js         # Email capture & storage
└── shareService.js        # Shareable URL generation

models/
├── Tool.js                # Tool schema
├── Audit.js               # Audit result schema
└── Lead.js                # Lead capture schema

utils/
├── validators.js          # Input validation
├── constants.js           # Tool definitions
└── helpers.js             # Shared functions
```

Each service:
- Is a pure module with focused responsibility
- Exports clearly-named functions
- Can be unit tested independently
- Handles errors gracefully
- Logs structured data

## Why This Stack

1. **React**: Familiar, declarative, component reusable, hooks for state
2. **Vite**: 10x faster build than CRA, instant HMR, smaller bundle
3. **Tailwind**: Utility-first, accessibility built-in, rapid iteration
4. **Zustand**: Lightweight state (single file vs Redux boilerplate)
5. **Supabase**: Free tier covers our needs, PostgreSQL when we scale
6. **Anthropic API**: Better for business reasoning than OpenAI for this use case
7. **Service modules**: Testable, maintainable, scales well

## Scaling to 10k audits/day

**Current bottlenecks at 10k QPS:**
- Single Node.js instance → Horizontal scale with load balancer
- DB queries → Implement Redis cache layer for pricing data
- Anthropic API rate limits → Batch summaries, use queue (Bull/BullMQ)
- File storage → Move shareable reports to CloudFront CDN

**Changes required:**
1. Add rate limiting (Redis-based)
2. Implement job queue for async summary generation
3. Cache pricing data with 1-hour TTL
4. Use connection pooling for Postgres
5. Add CDN for static assets & generated PDFs
6. Implement analytics pipeline (separate from main flow)

## Key Decisions

1. **Hardcoded audit rules, not AI**: Pricing logic must be defensible and deterministic, not LLM-based
2. **Supabase over Firebase**: Better control, SQL queries, more customizable
3. **Separate summary generation**: Non-blocking, can fail gracefully with templated fallback
4. **No login required**: Maximizes viral potential, email captured after value shown
5. **Public URLs**: No auth needed on shares, enabling viral growth

