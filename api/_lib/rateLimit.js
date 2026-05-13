const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 12

const getStore = () => {
  if (!globalThis.__luminaRateLimitStore) {
    globalThis.__luminaRateLimitStore = new Map()
  }

  return globalThis.__luminaRateLimitStore
}

const getClientKey = (req) => {
  const forwardedFor = req.headers['x-forwarded-for']

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0]
  }

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim()
  }

  return req.socket?.remoteAddress ?? 'unknown'
}

export function isRateLimited(req) {
  const store = getStore()
  const now = Date.now()
  const clientKey = getClientKey(req)
  const bucket = store.get(clientKey)

  if (!bucket || now - bucket.startedAt > WINDOW_MS) {
    store.set(clientKey, { count: 1, startedAt: now })
    return false
  }

  bucket.count += 1
  store.set(clientKey, bucket)

  return bucket.count > MAX_REQUESTS
}
