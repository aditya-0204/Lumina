import { getSupabaseRows, hasResendConfig, hasSupabaseConfig, insertSupabaseRow, sendLeadEmail } from './_lib/integrations.js'
import { getRequestOrigin, methodNotAllowed, sendJson } from './_lib/http.js'
import {
  buildEmailAuditSummary,
  buildPricingSnapshot,
  buildPricingVersion,
  compareAuditResults,
  comparePricingSnapshots,
  normalizeStoredAudit,
  rerunStoredAudit,
} from '../src/services/reauditService.js'

const buildNotificationId = (email, pricingVersion) => {
  const fingerprint = Array.from(pricingVersion).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return `reaudit_${email.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${fingerprint}`
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

const buildPricingChangeLabel = (change) => {
  if (change.type === 'added') {
    return `${change.toolKey} ${change.plan} was added at ${formatMoney(change.nextMonthly ?? 0)}/mo`
  }

  if (change.type === 'removed') {
    return `${change.toolKey} ${change.plan} was removed`
  }

  return `${change.toolKey} ${change.plan} moved from ${formatMoney(change.previousMonthly ?? 0)}/mo to ${formatMoney(change.nextMonthly ?? 0)}/mo`
}

const buildReauditEmailHtml = (email, audits, origin) => {
  const pricingChangeLines = [...new Set(audits.flatMap((item) => item.pricingChanges.map(buildPricingChangeLabel)))]
    .map((line) => `<li>${line}</li>`)
    .join('')

  const auditLines = audits
    .map((item) => {
      const summary = buildEmailAuditSummary(item)
      return [
        `<li style="margin-bottom:16px;">`,
        `<strong>Audit ${item.audit.id}</strong><br />`,
        `Previous recommendation: ${summary.previousTopRecommendation}<br />`,
        `Current recommendation: ${summary.nextTopRecommendation}<br />`,
        `Savings delta: ${formatMoney(summary.totalMonthlySavingsDelta)} / month<br />`,
        `<a href="${origin}?reaudit=${encodeURIComponent(item.audit.id)}">Re-run this audit</a>`,
        `</li>`,
      ].join('')
    })
    .join('')

  return [
    `<h1>Lumina pricing update</h1>`,
    `<p>We found pricing changes that affect one or more of your saved audits for ${email}.</p>`,
    `<h2>What changed</h2>`,
    `<ul>${pricingChangeLines}</ul>`,
    `<h2>How it affects your audits</h2>`,
    `<ul>${auditLines}</ul>`,
  ].join('')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  if (!hasSupabaseConfig()) {
    sendJson(res, 501, { error: 'Audit persistence is not configured' })
    return
  }

  try {
    const currentPricingSnapshot = buildPricingSnapshot()
    const pricingVersion = buildPricingVersion(currentPricingSnapshot)
    const origin = getRequestOrigin(req)

    const rows = await getSupabaseRows('audits', {
      select: 'id,email,input_stack,output_result,pricing_snapshot,shared_payload,created_at',
      order: 'created_at.desc',
    })

    const audits = rows.map(normalizeStoredAudit).filter((audit) => audit.email && audit.inputStack && audit.outputResult)

    const changedAudits = audits
      .map((audit) => {
        const currentResult = rerunStoredAudit(audit, currentPricingSnapshot)
        const diff = compareAuditResults(audit.outputResult, currentResult)

        if (!diff.changed) {
          return null
        }

        return {
          audit,
          previousResult: audit.outputResult,
          nextResult: currentResult,
          diff,
          pricingChanges: comparePricingSnapshots(audit.pricingSnapshot, currentPricingSnapshot),
        }
      })
      .filter(Boolean)

    const notifications = await getSupabaseRows('reaudit_notifications', {
      select: 'email,pricing_version',
      pricing_version: `eq.${pricingVersion}`,
    })

    const notifiedEmails = new Set(notifications.map((item) => item.email))
    const changedByEmail = changedAudits.reduce((groups, item) => {
      if (!groups[item.audit.email]) {
        groups[item.audit.email] = []
      }

      groups[item.audit.email].push(item)
      return groups
    }, {})

    const emailResults = []

    for (const [email, emailAudits] of Object.entries(changedByEmail)) {
      if (notifiedEmails.has(email)) {
        emailResults.push({
          email,
          sent: false,
          reason: 'already_sent_for_this_pricing_version',
          auditIds: emailAudits.map((item) => item.audit.id),
        })
        continue
      }

      let emailed = false

      if (hasResendConfig()) {
        await sendLeadEmail({
          to: email,
          subject: 'Your Lumina audit needs a pricing re-check',
          html: buildReauditEmailHtml(email, emailAudits, origin),
        })
        emailed = true
      }

      await insertSupabaseRow('reaudit_notifications', {
        id: buildNotificationId(email, pricingVersion),
        email,
        pricing_version: pricingVersion,
        audit_ids: emailAudits.map((item) => item.audit.id),
        sent_at: new Date().toISOString(),
      })

      emailResults.push({
        email,
        sent: emailed,
        reason: emailed ? 'email_sent' : 'logged_without_email_provider',
        auditIds: emailAudits.map((item) => item.audit.id),
      })
    }

    sendJson(res, 200, {
      auditsScanned: audits.length,
      changedAuditCount: changedAudits.length,
      affectedUsers: Object.keys(changedByEmail).length,
      emailResults,
    })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
