import { describe, expect, it } from 'vitest'
import { validateAuditForm } from './validators'

describe('validateAuditForm', () => {
  it('returns errors when required sections are missing', () => {
    const errors = validateAuditForm({
      email: '',
      tools: {},
      teamSize: '',
      useCase: '',
    })

    expect(errors.email).toBeTruthy()
    expect(errors.tools).toBeTruthy()
    expect(errors.teamSize).toBeTruthy()
    expect(errors.useCase).toBeTruthy()
  })

  it('accepts a valid tool selection with spend and seats', () => {
    const errors = validateAuditForm({
      email: 'founder@acme.dev',
      tools: {
        cursor: {
          plan: 'Pro',
          spend: 20,
          seats: 2,
        },
      },
      teamSize: 'small',
      useCase: 'Coding',
    })

    expect(errors).toEqual({})
  })

  it('flags invalid spend and seats', () => {
    const errors = validateAuditForm({
      email: 'ops@acme.dev',
      tools: {
        chatgpt: {
          plan: 'Plus',
          spend: -5,
          seats: 0,
        },
      },
      teamSize: 'medium',
      useCase: 'Mixed',
    })

    expect(errors.spend_chatgpt).toBe('Monthly spend cannot be negative')
    expect(errors.seats_chatgpt).toBe('Seats must be at least 1')
  })

  it('rejects invalid email addresses', () => {
    const errors = validateAuditForm({
      email: 'bad-email',
      tools: {
        cursor: {
          plan: 'Pro',
          spend: 20,
          seats: 1,
        },
      },
      teamSize: 'small',
      useCase: 'Coding',
    })

    expect(errors.email).toBe('Enter a valid email address')
  })
})
