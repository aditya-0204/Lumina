import { describe, expect, it } from 'vitest'
import { clonePricingCatalog, getMonthlyPrice, getPricingMeta, isPricePerUser } from './pricingService'

describe('pricingService', () => {
  it('returns known monthly prices', () => {
    expect(getMonthlyPrice('cursor', 'Pro')).toBe(20)
    expect(getMonthlyPrice('copilot', 'Business')).toBe(19)
  })

  it('returns pricing metadata for plans with notes', () => {
    expect(getPricingMeta('openai_api', 'Pay-as-you-go')?.note).toContain('input tokens')
  })

  it('marks per-user plans correctly', () => {
    expect(isPricePerUser('claude', 'Team')).toBe(true)
    expect(isPricePerUser('cursor', 'Pro')).toBe(false)
  })

  it('can resolve prices from a supplied pricing snapshot', () => {
    const snapshot = clonePricingCatalog()
    snapshot.cursor.Pro.monthly = 27

    expect(getMonthlyPrice('cursor', 'Pro', snapshot)).toBe(27)
    expect(getMonthlyPrice('cursor', 'Pro')).toBe(20)
  })
})
