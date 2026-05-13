import { sendJson, methodNotAllowed, readJsonBody } from './_lib/http.js'
import { insertSupabaseRow, sendLeadEmail, hasResendConfig, hasSupabaseConfig } from './_lib/integrations.js'
import { isRateLimited } from './_lib/rateLimit.js'

const buildEmailHtml = (lead, auditResults) => {
  return [
    `<h1>Lumina Audit Summary</h1>`,
    `<p>Monthly savings identified: <strong>$${auditResults.totalMonthlySavings}</strong></p>`,
    `<p>Annual savings identified: <strong>$${auditResults.totalAnnualSavings}</strong></p>`,
    `<p>Use case: ${auditResults.useCase}</p>`,
    `<p>Team size: ${auditResults.teamSize.range}</p>`,
    `<p>Summary: ${auditResults.executiveSummary?.content ?? auditResults.summary}</p>`,
    `<p>Saved for: ${lead.email}</p>`,
  ].join('')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'Too many requests' })
    return
  }

  try {
    const { lead, auditResults } = await readJsonBody(req)

    if (!lead || !auditResults) {
      sendJson(res, 400, { error: 'lead and auditResults are required' })
      return
    }

    if (lead.website) {
      sendJson(res, 400, { error: 'Spam detected' })
      return
    }

    let stored = false
    let emailed = false

    if (hasSupabaseConfig()) {
      await insertSupabaseRow('audits', {
        id: auditResults.auditId,
        payload: auditResults,
        created_at: auditResults.timestamp,
      })

      await insertSupabaseRow('leads', {
        id: lead.id,
        audit_id: auditResults.auditId,
        email: lead.email,
        company: lead.company,
        role: lead.role,
        team_size: lead.teamSize,
        monthly_savings: lead.monthlySavings,
        annual_savings: lead.annualSavings,
        created_at: lead.createdAt,
      })

      stored = true
    }

    if (hasResendConfig()) {
      await sendLeadEmail({
        to: lead.email,
        subject: 'Your Lumina AI spend audit',
        html: buildEmailHtml(lead, auditResults),
      })
      emailed = true
    }

    sendJson(res, 200, {
      stored,
      emailed,
      mode: stored || emailed ? 'live' : 'mock',
    })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
