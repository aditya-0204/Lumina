# Lumina - AI Spending Optimizer

Lumina is a lightweight web app for reviewing AI software spend and spotting savings opportunities. It is aimed at startup teams that want a quick view of current spend, better-fitting plans, and cheaper alternatives.

## What it does

1. Collects the team's current AI stack, plans, spend, seats, team size, and use case
2. Calculates total monthly and annual spend
3. Suggests cheaper plans or tool substitutions where they make sense
4. Shows a short written summary and lets users save the audit details

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
- Small client-side service modules for pricing, audit logic, summaries, and lead capture

## Current Progress

- Day 1: project setup, landing page, base structure
- Day 2: audit form, pricing constants, validation, local persistence
- Day 3: audit engine, results page, audit tests
- Day 4: summary section, lead capture flow, additional service tests

## Key Files

- `ARCHITECTURE.md`: current app structure and next backend steps
- `DEVLOG.md`: daily progress notes
- `TESTS.md`: test coverage notes
- `PROMPTS.md`: summary-writing notes
