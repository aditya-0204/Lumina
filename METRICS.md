# METRICS.md - Key Metrics & Success Measures

## North Star Metric

**"Audits completed with email captured"**

Why this over alternatives:
- DAU or MAU is not very useful for an occasional audit product
- Signups are not the point because the product does not require login
- Pageviews do not tell us whether the audit delivered value
- A completed audit plus saved contact details means both value delivered and lead captured

**Target:** 100 completed audits with email by the end of week 1

## 3 Input Metrics That Drive the North Star

### 1. Traffic to Tool
- Source: UTM-tagged acquisition tracking
- Target: 500 visitors in the first week
- Channels: Twitter, Product Hunt, Hacker News

### 2. Form Completion Rate
- Definition: users who submit the audit form divided by users who start the audit
- Target: 60%+

### 3. Email Capture Rate
- Definition: users who save details after seeing results divided by users who reach the results page
- Target: 50%+

**Relationships:**
- 500 visitors x 60% form completion = 300 audits
- 300 audits x 50% email capture = 150 emails

## Instrumentation Priorities

1. `audit_started`
2. `form_submitted`
3. `results_viewed`
4. `email_captured`
5. `result_shared`

## Secondary Metrics

- bounce rate
- average time to complete audit
- share rate
- return visitors
