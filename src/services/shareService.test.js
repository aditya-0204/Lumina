import { describe, expect, it, vi } from 'vitest'
import { buildShareUrl, getSharedAudit, saveShareableAudit } from './shareService'

describe('shareService', () => {
  it('saves and retrieves a PII-safe shared audit', () => {
    const store = {}
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => {
          store[key] = value
        }),
      },
    })

    const shareId = saveShareableAudit(
      {
        auditId: 'audit_1',
        timestamp: '2026-05-10T00:00:00.000Z',
        teamSize: { range: 'small', estimate: 3 },
        useCase: 'Coding',
        totalMonthlySpend: 100,
        totalAnnualSpend: 1200,
        totalMonthlySavings: 30,
        totalAnnualSavings: 360,
        recommendations: [],
        summary: 'Summary',
        executiveSummary: { content: 'Executive summary' },
        tools: [],
      },
      {
        tools: {
          cursor: { plan: 'Pro', spend: 20, seats: 1 },
          chatgpt: { plan: 'Plus', spend: 20, seats: 1 },
        },
      },
    )

    const sharedAudit = getSharedAudit(shareId)
    expect(sharedAudit.auditId).toBe('audit_1')
    expect(sharedAudit.toolCount).toBe(2)
    expect(sharedAudit.email).toBeUndefined()
    vi.unstubAllGlobals()
  })

  it('builds a share url with the share id', () => {
    expect(buildShareUrl('share_123', 'https://lumina.app')).toBe('https://lumina.app?share=share_123')
  })
})
