# SpendAudit - AI Spending Optimizer

A free web tool that audits your team's AI tool spending and surfaces optimization opportunities. Built for startup founders and engineering managers who want to understand their AI infrastructure costs.

## What it does

1. **Input your AI tools**: Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf, and APIs
2. **Get instant audit**: See where you're overspending and what alternatives exist
3. **Find savings**: Get personalized recommendations with realistic migration paths
4. **Share results**: Unique URL for your team to review and discuss
5. **Optional**: Book Credex consultation for high-savings cases

## Quick Start

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```
Open http://localhost:3000

### Deploy
```bash
npm run build
npm run preview
# Deploy the dist/ folder to Vercel, Netlify, or similar
```

## Screenshots & Demo
[Demo video link - coming after Day 3]

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend Services**: Node.js with service module pattern
- **Database**: Supabase
- **AI**: Anthropic Claude API
- **Email**: Resend
- **Deployment**: Vercel

## Key Decisions

1. **Vite over Create React App**: Faster dev experience, smaller bundle, instant HMR
2. **Zustand over Redux**: Simpler state management for this scope
3. **Service modules pattern**: Clean separation of audit logic, API calls, and data processing
4. **Tailwind CSS**: Rapid UI development with accessibility first
5. **Supabase**: Free tier sufficient for lead capture, real-time capable, PostgreSQL underneath

## Development Timeline

- **Day 1** (May 7): Project setup, landing page, basic structure
- **Day 2** (May 8): Spend input form, pricing data structure
- **Day 3** (May 9): Audit engine logic, results page
- **Day 4** (May 10): LLM integration, lead capture
- **Day 5** (May 11): Shareable URLs, tests, CI
- **Day 6** (May 12): User interviews, deployment
- **Day 7** (May 13): Final polish, submission

## Files Overview

- `README.md` (this file) - Project overview
- `ARCHITECTURE.md` - System design and data flow
- `DEVLOG.md` - Daily work log with learnings
- `REFLECTION.md` - Technical depth and decision-making
- `TESTS.md` - Test suite documentation
- `PRICING_DATA.md` - All pricing sources
- `PROMPTS.md` - LLM prompts used
- `GTM.md` - Go-to-market strategy
- `ECONOMICS.md` - Unit economics
- `USER_INTERVIEWS.md` - User research
- `LANDING_COPY.md` - Landing page copy
- `METRICS.md` - Key metrics and North Star

## Running Tests

```bash
npm test
```

## Deployed URL
[Live link - coming after Day 5]

## License

Credex © 2026. Code is public; you're free to use it for your portfolio.

---

Built with dedication over 7 days by a Credex intern candidate. May 7-13, 2026.
