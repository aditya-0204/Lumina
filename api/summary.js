import { buildFallbackSummary } from '../src/services/summaryService.js'
import { sendJson, methodNotAllowed, readJsonBody } from './_lib/http.js'
import { isRateLimited } from './_lib/rateLimit.js'
import { buildSummaryPrompt } from './_lib/summaryPrompt.js'

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest'

async function generateAnthropicSummary(auditResults, auditData) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: 220,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: buildSummaryPrompt(auditResults, auditData),
        },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Anthropic request failed: ${text}`)
  }

  const payload = await response.json()
  const content = payload.content?.find((item) => item.type === 'text')?.text?.trim()

  if (!content) {
    throw new Error('Anthropic response did not include summary text')
  }

  return content
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'Too many requests' })
    return
  }

  try {
    const requestBody = await readJsonBody(req)
    const { auditResults, auditData } = requestBody

    if (!auditResults || !auditData) {
      sendJson(res, 400, { error: 'auditResults and auditData are required' })
      return
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      sendJson(res, 200, {
        content: buildFallbackSummary(auditResults, auditData),
        source: 'template',
      })
      return
    }

    const content = await generateAnthropicSummary(auditResults, auditData)
    sendJson(res, 200, { content, source: 'anthropic' })
  } catch (error) {
    sendJson(res, 500, { error: error.message })
  }
}
