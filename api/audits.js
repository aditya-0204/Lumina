import { methodNotAllowed, readJsonBody, sendJson } from './_lib/http.js'
import { hasSupabaseConfig, upsertSupabaseRow } from './_lib/integrations.js'
import { buildShareableAudit } from '../src/services/shareService.js'
import { buildPricingSnapshot, buildStoredAuditRecord } from '../src/services/reauditService.js'

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
    const { email, auditInput, auditResults } = await readJsonBody(req)

    if (!email || !auditInput || !auditResults) {
      sendJson(res, 400, { error: 'email, auditInput, and auditResults are required' })
      return
    }

    const sharedAudit = buildShareableAudit(auditResults, auditInput)
    const storedAudit = buildStoredAuditRecord({
      auditId: auditResults.auditId,
      email,
      auditInput,
      auditResult: auditResults,
      pricingSnapshot: buildPricingSnapshot(),
      sharedAudit,
      createdAt: auditResults.timestamp,
    })

    await upsertSupabaseRow('audits', storedAudit, 'id')

    sendJson(res, 200, {
      stored: true,
      auditId: auditResults.auditId,
    })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
