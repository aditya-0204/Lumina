import { describe, expect, it } from 'vitest'
import { calculateAudit } from './auditService'
import { clonePricingCatalog } from './pricingService'
import { buildPricingSnapshot, compareAuditResults, rerunStoredAudit } from './reauditService'

describe('reauditService', () => {
  it('clones pricing snapshots for storage', () => {
    const snapshot = buildPricingSnapshot()
    snapshot.cursor.Pro.monthly = 99

    const freshSnapshot = buildPricingSnapshot()
    expect(freshSnapshot.cursor.Pro.monthly).toBe(20)
  })

  it('reruns a stored audit with a new pricing catalog', () => {
    const inputStack = {
      teamSize: 'small',
      useCase: 'Coding',
      tools: {
        copilot: {
          plan: 'Individual',
          spend: 60,
          seats: 5,
        },
      },
    }

    const storedAudit = {
      id: 'audit_existing',
      inputStack,
    }

    const cheaperCursor = clonePricingCatalog()
    cheaperCursor.cursor.Pro.monthly = 8

    const rerun = rerunStoredAudit(storedAudit, cheaperCursor)
    expect(rerun.auditId).toBe('audit_existing')
    expect(rerun.totalMonthlySavings).toBeGreaterThan(0)
  })

  it('detects recommendation diffs between previous and current results', () => {
    const formData = {
      teamSize: 'small',
      useCase: 'Coding',
      tools: {
        copilot: {
          plan: 'Individual',
          spend: 60,
          seats: 5,
        },
      },
    }

    const previousPricing = clonePricingCatalog()
    previousPricing.cursor.Pro.monthly = 20

    const currentPricing = clonePricingCatalog()
    currentPricing.cursor.Pro.monthly = 15

    const previousResult = calculateAudit(formData, previousPricing, {
      auditId: 'audit_1',
      timestamp: '2026-05-20T09:00:00.000Z',
    })
    const nextResult = calculateAudit(formData, currentPricing, {
      auditId: 'audit_1',
      timestamp: '2026-05-20T12:00:00.000Z',
    })

    const diff = compareAuditResults(previousResult, nextResult)
    expect(diff.changed).toBe(true)
    expect(diff.totalMonthlySavingsDelta).toBeGreaterThan(0)
  })
})
