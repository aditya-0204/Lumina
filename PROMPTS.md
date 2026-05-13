# PROMPTS.md

## Summary Generation Goal

Lumina generates a short executive summary after the numeric audit is complete. The goal is to translate the tool-by-tool recommendation output into a 90-120 word paragraph that a founder, CTO, finance lead, or operations lead can read quickly.

## Prompt Used For `/api/summary`

System intent:

```text
You are writing a concise executive summary for an AI spend audit.
Write 90 to 120 words.
Sound specific and practical, not promotional.
Mention the monthly and annual savings totals.
Mention the strongest recommendation.
If savings are below $100/month, say the stack is already in good shape and suggest light ongoing review.
Do not use bullet points.
```

User payload shape:

```text
Team size range: {teamSize.range}
Estimated team size: {teamSize.estimate}
Primary use case: {useCase}
Tools audited: {toolCount}
Total monthly spend: {totalMonthlySpend}
Total monthly savings: {totalMonthlySavings}
Total annual savings: {totalAnnualSavings}

For each tool:
- Tool name
- Current plan
- Current monthly spend
- Recommended plan or replacement
- Monthly savings
- Reason
```

The exact runtime prompt builder lives in `api/_lib/summaryPrompt.js`.

## Why This Prompt

- It is short enough to stay consistent and cheap.
- It anchors the model on actual audit outputs instead of asking for freeform advice.
- It explicitly handles the low-savings case so the summary can remain honest when Lumina does not find much to optimize.
- It keeps the tone practical rather than sales-heavy.

## What I Tried

1. A very short prompt that only included total savings and the top recommendation. It produced readable output, but it sometimes ignored team context.
2. A much longer prompt with extra product framing. It sounded polished but became too generic and promotional.
3. The final version keeps only the fields that materially affect the conclusion.

## Fallback Strategy

If the Anthropic request fails or an API key is missing, the client falls back to `buildFallbackSummary` in `src/services/summaryService.js`. That fallback is deterministic and keeps the app usable even without external infrastructure.
