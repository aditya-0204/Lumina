import { describe, expect, it, vi } from 'vitest'
import { buildLeadPayload, saveLeadCapture, validateLeadForm } from './leadCaptureService'

describe('leadCaptureService', () => {
  it('validates required email and honeypot fields', () => {
    const errors = validateLeadForm({
      email: 'bad-email',
      company: '',
      role: '',
      website: 'bot',
    })

    expect(errors.email).toBe('Enter a valid email address')
    expect(errors.website).toBe('Spam detected')
  })

  it('builds payloads with audit context', () => {
    const payload = buildLeadPayload(
      {
        email: 'test@example.com',
        company: 'Acme',
        role: 'CTO',
        website: '',
      },
      {
        auditId: 'audit_123',
        teamSize: { range: 'medium' },
        totalMonthlySavings: 150,
        totalAnnualSavings: 1800,
      },
    )

    expect(payload.email).toBe('test@example.com')
    expect(payload.auditId).toBe('audit_123')
    expect(payload.monthlySavings).toBe(150)
  })

  it('stores leads in localStorage when window is available', () => {
    const store = {}
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => {
          store[key] = value
        }),
      },
    })

    const payload = { id: 'lead_1', email: 'test@example.com' }
    saveLeadCapture(payload)

    expect(store['lumina.leads.v1']).toContain('lead_1')
    vi.unstubAllGlobals()
  })
})
