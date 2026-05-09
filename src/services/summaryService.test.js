import { describe, expect, it } from 'vitest'
import { buildFallbackSummary, generateExecutiveSummary } from './summaryService'

const auditData = {
  tools: {
    chatgpt: { plan: 'Team', spend: 120, seats: 4 },
    cursor: { plan: 'Business', spend: 80, seats: 2 },
  },
}

const auditResults = {
  auditId: 'audit_123',
  teamSize: { range: 'small', estimate: 3 },
  useCase: 'Coding',
  totalMonthlySavings: 60,
  totalAnnualSavings: 720,
  tools: [
    {
      toolName: 'ChatGPT',
      recommendedToolName: 'Claude',
      recommendedPlan: 'Pro',
      recommendationType: 'switch',
      monthlySavings: 60,
    },
  ],
}

describe('summaryService', () => {
  it('builds a summary with quantified savings', () => {
    const summary = buildFallbackSummary(auditResults, auditData)

    expect(summary).toContain('$60')
    expect(summary).toContain('Claude Pro')
  })

  it('returns async summary metadata', async () => {
    const summary = await generateExecutiveSummary(auditResults, auditData)

    expect(summary.content.length).toBeGreaterThan(50)
  })
})
