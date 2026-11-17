import { getSupabaseRows, hasSupabaseConfig } from './_lib/integrations.js'
import { methodNotAllowed, sendJson } from './_lib/http.js'
import { normalizeStoredAudit } from '../src/services/reauditService.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET'])
    return
  }

  if (!hasSupabaseConfig()) {
    sendJson(res, 501, { error: 'Audit persistence is not configured' })
    return
  }

  try {
    const auditId = req.query?.id

    if (!auditId) {
      sendJson(res, 400, { error: 'id is required' })
      return
    }

    const rows = await getSupabaseRows('audits', {
      select: 'id,email,input_stack,output_result,pricing_snapshot,shared_payload,created_at',
      id: `eq.${auditId}`,
      limit: '1',
    })

    if (!rows[0]) {
      sendJson(res, 404, { error: 'Audit not found' })
      return
    }

    sendJson(res, 200, { audit: normalizeStoredAudit(rows[0]) })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
