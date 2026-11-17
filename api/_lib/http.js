export async function readJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body)
    }

    return req.body
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export function methodNotAllowed(res, allowedMethods) {
  res.setHeader('Allow', allowedMethods.join(', '))
  sendJson(res, 405, { error: 'Method not allowed' })
}

export function getRequestOrigin(req) {
  const forwardedProto = req.headers['x-forwarded-proto']
  const forwardedHost = req.headers['x-forwarded-host']
  const host = forwardedHost || req.headers.host

  if (!host) {
    return process.env.APP_ORIGIN || 'http://localhost:5173'
  }

  return `${forwardedProto || 'https'}://${host}`
}
