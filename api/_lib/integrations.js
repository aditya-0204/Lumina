const SUPABASE_HEADERS = (serviceKey) => ({
  'Content-Type': 'application/json',
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  Prefer: 'return=representation',
})

export const hasSupabaseConfig = () => {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function insertSupabaseRow(table, payload) {
  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured')
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: SUPABASE_HEADERS(process.env.SUPABASE_SERVICE_ROLE_KEY),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase insert failed: ${text}`)
  }

  return response.json()
}

export async function getSupabaseRows(table, query) {
  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured')
  }

  const searchParams = new URLSearchParams(query)
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?${searchParams.toString()}`, {
    headers: SUPABASE_HEADERS(process.env.SUPABASE_SERVICE_ROLE_KEY),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase read failed: ${text}`)
  }

  return response.json()
}

export const hasResendConfig = () => {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export async function sendLeadEmail({ to, subject, html }) {
  if (!hasResendConfig()) {
    throw new Error('Resend is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Resend email failed: ${text}`)
  }

  return response.json()
}
