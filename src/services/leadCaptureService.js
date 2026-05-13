export const LEAD_CAPTURE_STORAGE_KEY = 'lumina.leads.v1'

export const validateLeadForm = (leadForm) => {
  const errors = {}

  if (!leadForm.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (leadForm.website) {
    errors.website = 'Spam detected'
  }

  return errors
}

export const buildLeadPayload = (leadForm, auditResults) => {
  return {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    email: leadForm.email.trim(),
    company: leadForm.company.trim(),
    role: leadForm.role.trim(),
    teamSize: auditResults.teamSize.range,
    monthlySavings: auditResults.totalMonthlySavings,
    annualSavings: auditResults.totalAnnualSavings,
    auditId: auditResults.auditId,
    createdAt: new Date().toISOString(),
  }
}

export const saveLeadCapture = (payload) => {
  if (typeof window === 'undefined') {
    return payload
  }

  const existing = window.localStorage.getItem(LEAD_CAPTURE_STORAGE_KEY)
  const leads = existing ? JSON.parse(existing) : []
  leads.push(payload)
  window.localStorage.setItem(LEAD_CAPTURE_STORAGE_KEY, JSON.stringify(leads))
  return payload
}

export const submitLeadCapture = async (payload, auditResults) => {
  if (typeof fetch !== 'function') {
    saveLeadCapture(payload)
    return { mode: 'local' }
  }

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead: payload,
        auditResults,
      }),
    })

    if (!response.ok) {
      throw new Error('Lead submission failed')
    }

    return response.json()
  } catch {
    saveLeadCapture(payload)
    return { mode: 'local' }
  }
}
