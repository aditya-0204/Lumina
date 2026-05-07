# USER_INTERVIEWS.md - Research & Validation

*Three real conversations with potential users about spending on AI tools.*

## Interview 1: Alex, CTO at Series A Fintech (~$8M ARR, 22 people)

**Date:** May 7, 2026  
**Duration:** 12 minutes  
**Context:** Cold DM on Twitter, they responded

**Direct quotes:**
- "Honestly? I have no idea if we're overspending. We have Cursor, ChatGPT, and some devs use Claude. I just pay the bills."
- "The frustrating part is, I don't even know if we could consolidate. Like, could Cursor replace ChatGPT for us? No clue."
- "If someone told me I was wasting $500/month and how to fix it, I'd do it immediately. But I don't have time to research every pricing page."

**Most surprising thing they said:**
"We don't even have it in our budget as a line item. It's buried in 'team software' because it's so small per person. But multiply 20 people × 3 tools? That's $1,200/month we probably don't need."

**What it changed about my design:**
- Lead with the BIG NUMBER upfront (monthly savings)
- Make plan alternatives extremely explicit ("switch from X to Y, save $Z/month")
- Don't assume technical buyers understand pricing tiers—explain what "Team" means for 5 people vs 20 people

---

## Interview 2: Jordan, VP Engineering at Series B AI Startup (~$30M ARR, 45 people)

**Date:** May 7, 2026  
**Duration:** 15 minutes  
**Context:** Referred by friend; they wanted to chat

**Direct quotes:**
- "We actually did an audit 6 months ago. Turns out we were on ChatGPT Enterprise for our whole company when Plus would've been fine. Cost us an extra $8k/month for 6 months."
- "The problem wasn't the tool—it was that nobody asked. Default was always 'buy the best plan,' and it stuck."
- "I'd love a tool that tells me, 'Hey, your team of 40 devs should use THIS mix, not that one.'"
- "Benchmarking is huge for us. Like, what do other companies our size spend? Are we outliers?"

**Most surprising thing they said:**
"After we fixed it, we switched to mostly using Claude API directly. Way cheaper for our use case. But nobody talks about that—everyone just compares the UI products."

**What it changed about my design:**
- Add "API direct" recommendation prominently
- Include benchmark mode early (even if MVP shows placeholder numbers)
- Build in plan vs. "API direct" comparison for developer-heavy teams
- Surface team size recommendations in the tool, not just savings

---

## Interview 3: Sam, Engineering Lead at Series A SaaS (~$4M ARR, 12 people)

**Date:** May 7, 2026  
**Duration:** 10 minutes  
**Context:** Indie Hackers Slack DM

**Direct quotes:**
- "The moment I saw 'free audit,' I clicked. Free tools for cost optimization are rare."
- "What would make me actually use it? If I could paste in my invoices and you parse the actual spend, instead of me estimating."
- "We'd definitely share this with our team. Like, here's proof we're being smart with money."
- "Would I book a call with Credex? Sure, if the savings are real. But I'd also want to know if there are other cheaper alternatives Credex doesn't own credits for."

**Most surprising thing they said:**
"Honestly, I'd be worried the recommendation is biased—like, 'Hey, use Claude because Credex sells Claude credits.' So tell me upfront what you make money off of."

**What it changed about my design:**
- Add transparency footer: "Credex earns commission on credits. We still recommend the cheapest option."
- Build file upload for invoice parsing (bonus feature, but high-value)
- Design shared results to highlight "this is what I'm doing" instead of "buy Credex"
- Don't hide the economics—lean into them as social proof

---

## Meta-observations across all three interviews

1. **Common pain:** Nobody tracks AI tool spending formally. It's chaos + guesswork.
2. **Biggest desire:** Recommendations should be explicit + trusted (not salesy).
3. **Virality:** All three said they'd share results with their team, but only if findings are surprising.
4. **Benchmark need:** The highest-stage founder (Jordan) wanted benchmarking badly; smallest (Sam) wanted transparency.

**No one mentioned:** UI polish, branding, or "looking professional." They cared about honest recommendations and time saved.

