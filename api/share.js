import { sendJson, methodNotAllowed, readJsonBody } from './_lib/http.js'
import { getSupabaseRows, hasSupabaseConfig, insertSupabaseRow } from './_lib/integrations.js'
import { isRateLimited } from './_lib/rateLimit.js'

const createShareId = () => {
  return `share_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!hasSupabaseConfig()) {
      sendJson(res, 501, { error: 'Share persistence is not configured' })
      return
    }

    try {
      const shareId = req.query?.id

      if (!shareId) {
        sendJson(res, 400, { error: 'id is required' })
        return
      }

      const rows = await getSupabaseRows('shared_audits', {
        select: 'payload',
        share_id: `eq.${shareId}`,
        limit: '1',
      })

      if (!rows[0]?.payload) {
        sendJson(res, 404, { error: 'Shared audit not found' })
        return
      }

      sendJson(res, 200, { shareId, audit: rows[0].payload })
    } catch (error) {
      sendJson(res, 500, { error: error.message })
    }

    return
  }

  if (req.method !== 'POST') {
    methodNotAllowed(res, ['GET', 'POST'])
    return
  }

  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'Too many requests' })
    return
  }

  if (!hasSupabaseConfig()) {
    sendJson(res, 501, { error: 'Share persistence is not configured' })
    return
  }

  try {
    const { audit } = await readJsonBody(req)

    if (!audit) {
      sendJson(res, 400, { error: 'audit is required' })
      return
    }

    const shareId = createShareId()

    await insertSupabaseRow('shared_audits', {
      share_id: shareId,
      audit_id: audit.auditId,
      payload: audit,
      created_at: new Date().toISOString(),
    })

    sendJson(res, 200, { shareId })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
