# Lumina - AI Spending Optimizer

Lumina is a lightweight web app for reviewing AI software spend and spotting savings opportunities. It is aimed at startup teams that want a quick view of current spend, better-fitting plans, cheaper alternatives, and a shareable audit they can discuss internally.

## What it does

1. Collects the team's current AI stack, plans, spend, seats, team size, and use case
2. Calculates total monthly and annual spend
3. Suggests cheaper plans or tool substitutions where they make sense
4. Shows a short written summary of the audit
5. Lets users save audit details and create a shareable audit link

## Quick Start

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```

### Validate
```bash
npm run lint
npm run test -- --run
npm run build
```

## Stack

- React 18
- Vite
- Tailwind CSS
- Client-side service modules for pricing, audit logic, summaries, lead capture, and sharing

## Current Progress

- Day 1: project setup, landing page, base structure
- Day 2: audit form, pricing constants, validation, local persistence
- Day 3: audit engine, results page, audit tests
- Day 4: summary section, lead capture flow, additional service tests
- Day 5: PII-safe share links and shared audit loading
- Day 6: landing-page polish, metadata cleanup, visual refinement

## Key Files

- `ARCHITECTURE.md`: current app structure and next backend steps
- `DEVLOG.md`: daily progress notes
- `TESTS.md`: test coverage notes
- `PROMPTS.md`: summary-writing notes
