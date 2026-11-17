export const persistCompletedAudit = async ({ email, auditInput, auditResults }) => {
  if (typeof fetch !== 'function') {
    return { stored: false, mode: 'local' }
  }

  try {
    const response = await fetch('/api/audits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        auditInput,
        auditResults,
      }),
    })

    if (!response.ok) {
      throw new Error('Audit persistence failed')
    }

    return response.json()
  } catch {
    return { stored: false, mode: 'local' }
  }
}
