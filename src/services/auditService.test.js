import { describe, expect, it } from 'vitest'
import { calculateAudit } from './auditService'

describe('calculateAudit', () => {
  it('recommends lower-fit plans for small teams', () => {
    const result = calculateAudit({
      teamSize: 'small',
      useCase: 'Mixed',
      tools: {
        chatgpt: {
          plan: 'Team',
          spend: 120,
          seats: 4,
        },
      },
    })

    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.tools[0].recommendedPlan).toBe('Plus')
    expect(result.tools[0].recommendationType).toBe('plan')
  })

  it('can suggest a cross-vendor alternative for coding workflows', () => {
    const result = calculateAudit({
      teamSize: 'small',
      useCase: 'Coding',
      tools: {
        copilot: {
          plan: 'Individual',
          spend: 60,
          seats: 5,
        },
      },
    })

    expect(result.tools[0].monthlySavings).toBeGreaterThan(0)
    expect(result.tools[0].recommendedToolName).toBe('Cursor')
    expect(result.tools[0].recommendationType).toBe('switch')
  })

  it('keeps tools unchanged when there is no cheaper practical option', () => {
    const result = calculateAudit({
      teamSize: 'small',
      useCase: 'Coding',
      tools: {
        cursor: {
          plan: 'Pro',
          spend: 20,
          seats: 1,
        },
      },
    })

    expect(result.totalMonthlySavings).toBe(0)
    expect(result.tools[0].recommendationType).toBe('keep')
    expect(result.tools[0].recommendedMonthlySpend).toBe(20)
  })
})
