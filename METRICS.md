# METRICS.md - Key Metrics & Success Measures

## North Star Metric

**"Audits completed with email captured"**

Why this over alternatives:
- DAU/MAU doesn't work (people use this once every 3 months)
- Signups don't matter (no login required)
- Pageviews are misleading
- "Audits completed + email captured" = user got value + Credex has a lead

**Target:** 100 completed audits with email by end of week 1

---

## 3 Input Metrics That Drive North Star

### 1. Traffic to Tool
- Source: Google Analytics UTM tracking
- Target: 500 visitors/week by week 1
- Channels: Twitter (viral), Product Hunt, Hacker News
- Trigger to pivot: <100 visitors by day 3

### 2. Form Completion Rate
- Definition: (Users who finish inputting tools) / (Users who click "Start Audit")
- Target: 60%+ (people need to hit submit button)
- Trigger to pivot: <40% = form too complex, redesign

### 3. Email Capture Rate
- Definition: (Users who enter email after audit) / (Users who saw results)
- Target: 50%+
- Trigger to pivot: <30% = need better CTA or offer

**Relationships:**
- 500 visitors × 60% form completion = 300 audits
- 300 audits × 50% email capture = 150 emails = **150 leads**

*(Goal: 100 leads by week 1; this projects 150)*

---

## What to Instrument First

1. **Analytics events in code** (Segment or Mixpanel):
   - `audit_started` (user clicked "Start Audit")
   - `form_submitted` (user clicked submit)
   - `results_viewed` (user saw audit results)
   - `email_captured` (user entered email)
   - `result_shared` (user clicked share link)

2. **Supabase queries:**
   - Count completed audits per day
   - Count unique emails captured
   - Count unique shared URLs

3. **Manual tracking sheet:**
   - Daily: visitor count, completion rate, leads, feedback
   - Helps catch anomalies before analytics lag

---

## Pivot Trigger: What Number Kills the Experiment

| Metric | By When | Red Flag |
|--------|---------|----------|
| Website traffic | Day 2 EOD | <100 visitors (means zero organic reach) |
| Audit completion | Day 3 EOD | <20 completed (means form is broken) |
| Email capture rate | Day 4 EOD | <25% (means no lead generation) |
| Total leads | End of week 1 | <30 leads (means product-market fit is weak) |

If **any** of these hit, pivot to:
- Different GTM channel (TikTok, YouTube, LinkedIn)
- Simpler form (fewer fields)
- Invoice upload instead of manual entry
- Benchmark mode instead of recommendations

---

## Secondary Metrics (Not Pivot-Deciding)

- **Bounce rate:** <50% target (people leave landing page without interacting)
- **Average audit time:** 3-5 minutes target (too fast = user didn't read; too slow = friction)
- **Share rate:** % of audits that get shared URL (viral coefficient)
- **Return visitors:** % of people who come back (shouldn't be high for this use case)

---

## Revenue Proxy (Late May)

Once we have leads:
- **Lead-to-consultation rate:** 30%+ (tracked by Credex sales team)
- **Consultation-to-close rate:** 30%+ (tracked by Credex)
- **Customer LTV:** $5,100+ (after first year)

These are owned by Credex sales, not us, but we track to validate the funnel works.

