# PROMPTS.md - LLM Prompts & Strategy

## Summary Generation Prompt

**Purpose:** Generate a personalized, 100-word summary of the audit findings

**Prompt Template:**

```
You are a financial advisor specializing in SaaS tool optimization for tech companies.

Analyze this AI tool spending audit and write a brief, personalized summary (exactly 100 words).
Format: One punchy paragraph. Include specific savings amount and primary recommendation.

User's tools: {TOOLS}
Current annual spend: ${ANNUAL_SPEND}
Total potential savings: ${TOTAL_SAVINGS}
Primary recommendation: {PRIMARY_RECOMMENDATION}
Team size: {TEAM_SIZE}
Use case: {USE_CASE}

Write the summary directly—no preamble or explanation. Make it feel personal and actionable, 
as if written by a peer who understands their workflow. Tone: confident, specific, encouraging.
```

**Why this prompt:**
- Forces specificity (100 words, not "about 100")
- Uses placeholders for injection, avoiding prompt injection
- Includes context to make summary feel personalized
- Emphasizes tone to avoid generic marketing copy

## Fallback Template (if API fails)

If Anthropic API times out or fails, we use this templated fallback:

```
Your team is spending $X/month on AI tools and could save $Y by optimizing your plan mix. 
The biggest opportunity is {TOOL_NAME}—consider switching from {CURRENT_PLAN} to {SUGGESTED_PLAN} 
or exploring {ALTERNATIVE_TOOL}. This single change could free up ${IMMEDIATE_SAVINGS}/month. 
For high-value opportunities, Credex can help you source discounted credits on {TOOL_NAME}.
```

## What I Tried That Didn't Work

*(To be filled after Day 4 when LLM is integrated)*

## LLM Choice Rationale

- **Anthropic Claude (preferred)**: Better at financial reasoning, less prone to hallucination on numbers
- **Fallback to OpenAI GPT-4**: If Anthropic credits run out
- **Structured outputs**: All LLM responses validated against JSON schema before rendering

## API Failure Handling

1. Try Anthropic API with 5-second timeout
2. If timeout → use templated fallback
3. Log error for debugging
4. Still return full audit (summary is optional enhancement)
5. Monitor error rate in metrics dashboard

