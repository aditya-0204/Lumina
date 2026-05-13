export const SHARED_AUDITS_STORAGE_KEY = 'lumina.sharedAudits.v1'

const readSharedAudits = () => {
  if (typeof window === 'undefined') return {}
  const raw = window.localStorage.getItem(SHARED_AUDITS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

const writeSharedAudits = (sharedAudits) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SHARED_AUDITS_STORAGE_KEY, JSON.stringify(sharedAudits))
}

export const createShareId = () => {
  return `share_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export const buildShareableAudit = (auditResults, auditData) => {
  const toolCount = Object.keys(auditData.tools || {}).length

  return {
    auditId: auditResults.auditId,
    timestamp: auditResults.timestamp,
    teamSize: auditResults.teamSize,
    useCase: auditResults.useCase,
    totalMonthlySpend: auditResults.totalMonthlySpend,
    totalAnnualSpend: auditResults.totalAnnualSpend,
    totalMonthlySavings: auditResults.totalMonthlySavings,
    totalAnnualSavings: auditResults.totalAnnualSavings,
    recommendations: auditResults.recommendations,
    summary: auditResults.summary,
    executiveSummary: auditResults.executiveSummary,
    tools: auditResults.tools,
    toolCount,
    sharedAt: new Date().toISOString(),
  }
}

export const saveShareableAudit = (auditResults, auditData) => {
  const shareId = createShareId()
  const sharedAudits = readSharedAudits()
  sharedAudits[shareId] = buildShareableAudit(auditResults, auditData)
  writeSharedAudits(sharedAudits)
  return shareId
}

export const getSharedAudit = (shareId) => {
  const sharedAudits = readSharedAudits()
  return sharedAudits[shareId] ?? null
}

export const buildShareUrl = (shareId, origin) => {
  return `${origin}?share=${shareId}`
}

export const createShareableAuditLink = async (auditResults, auditData, origin) => {
  const audit = buildShareableAudit(auditResults, auditData)

  if (typeof fetch === 'function') {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audit }),
      })

      if (response.ok) {
        const payload = await response.json()
        return buildShareUrl(payload.shareId, origin)
      }
    } catch {
      // Fall through to local storage.
    }
  }

  return buildShareUrl(saveShareableAudit(auditResults, auditData), origin)
}

export const resolveSharedAudit = async (shareId) => {
  if (typeof fetch === 'function') {
    try {
      const response = await fetch(`/api/share?id=${encodeURIComponent(shareId)}`)

      if (response.ok) {
        const payload = await response.json()
        return payload.audit
      }
    } catch {
      // Fall through to local storage.
    }
  }

  return getSharedAudit(shareId)
}
