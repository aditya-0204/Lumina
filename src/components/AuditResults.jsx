import { useState } from 'react'
import { buildLeadPayload, saveLeadCapture, validateLeadForm } from '../services/leadCaptureService'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

const formatRangeLabel = (range) => {
  const labels = {
    small: '1-5 people',
    medium: '6-15 people',
    large: '16-50 people',
    enterprise: '50+ people',
  }

  return labels[range] ?? range
}

const createLeadForm = () => ({
  email: '',
  company: '',
  role: '',
  website: '',
})

export function AuditResults({ data, auditData, onBack, onEdit }) {
  const highestSavingsTool = data.tools[0]
  const [leadForm, setLeadForm] = useState(createLeadForm)
  const [leadErrors, setLeadErrors] = useState({})
  const [leadStatus, setLeadStatus] = useState('idle')

  const handleLeadChange = (field, value) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLeadSubmit = (event) => {
    event.preventDefault()
    const errors = validateLeadForm(leadForm)

    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors)
      return
    }

    const payload = buildLeadPayload(leadForm, data)
    saveLeadCapture(payload)
    setLeadErrors({})
    setLeadStatus('saved')
    setLeadForm(createLeadForm())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Audit Results</p>
            <h1 className="mt-2 text-4xl font-bold">Your AI Spend Audit</h1>
            <p className="mt-3 max-w-2xl text-slate-300">{data.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onEdit}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Edit Inputs
            </button>
            <button
              onClick={onBack}
              className="rounded-xl bg-credex-light px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500"
            >
              Back Home
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Current Monthly Spend</p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(data.totalMonthlySpend)}</p>
          </div>
          <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-5">
            <p className="text-sm text-emerald-100/70">Potential Monthly Savings</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-300">{formatCurrency(data.totalMonthlySavings)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Potential Annual Savings</p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(data.totalAnnualSavings)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Audit Scope</p>
            <p className="mt-3 text-lg font-semibold">{Object.keys(auditData.tools).length} tools</p>
            <p className="mt-1 text-sm text-slate-400">
              {formatRangeLabel(data.teamSize.range)} • {data.useCase}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/5 to-emerald-300/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/80">Executive Summary</p>
            <h2 className="mt-4 text-2xl font-semibold">Key takeaway from this audit</h2>
            <p className="mt-4 max-w-3xl text-slate-200">{data.executiveSummary.content}</p>
          </div>

          <form onSubmit={handleLeadSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200/80">Save This Audit</p>
            <h2 className="mt-4 text-2xl font-semibold">Email this summary to yourself</h2>
            <p className="mt-3 text-slate-300">
              Enter your details to keep a record of this audit and its savings estimate.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Work Email</label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(event) => handleLeadChange('email', event.target.value)}
                  className={`w-full rounded-xl border bg-slate-950/50 px-4 py-3 text-white outline-none ${
                    leadErrors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="you@company.com"
                />
                {leadErrors.email && <p className="mt-1 text-sm text-red-400">{leadErrors.email}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Company</label>
                  <input
                    type="text"
                    value={leadForm.company}
                    onChange={(event) => handleLeadChange('company', event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none"
                    placeholder="Acme"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Role</label>
                  <input
                    type="text"
                    value={leadForm.role}
                    onChange={(event) => handleLeadChange('role', event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none"
                    placeholder="CTO"
                  />
                </div>
              </div>

              <div className="hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  value={leadForm.website}
                  onChange={(event) => handleLeadChange('website', event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-credex-light px-4 py-3 text-base font-semibold text-black transition hover:bg-emerald-500"
              >
                Save Audit Summary
              </button>

              {leadStatus === 'saved' && (
                <p className="text-sm text-emerald-300">Your audit details have been saved.</p>
              )}
            </div>
          </form>
        </section>

        {highestSavingsTool && (
          <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/5 to-emerald-300/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/80">Top Recommendation</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {highestSavingsTool.toolName}
                  {highestSavingsTool.monthlySavings > 0
                    ? ` can save ${formatCurrency(highestSavingsTool.monthlySavings)}/mo`
                    : ' looks healthy'}
                </h2>
                <p className="mt-2 max-w-3xl text-slate-300">{highestSavingsTool.reason}</p>
              </div>
              <div className="rounded-2xl bg-black/20 px-4 py-3 text-right">
                <p className="text-sm text-slate-400">Projected annual impact</p>
                <p className="text-2xl font-semibold text-amber-200">{formatCurrency(highestSavingsTool.annualSavings)}</p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Per-Tool Breakdown</h2>
            <p className="text-sm text-slate-400">Current setup compared with our cheapest practical recommendation</p>
          </div>

          <div className="space-y-4">
            {data.tools.map((tool) => (
              <article key={tool.toolKey} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold">{tool.toolName}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                          tool.monthlySavings > 0
                            ? 'bg-emerald-400/15 text-emerald-300'
                            : 'bg-slate-200/10 text-slate-300'
                        }`}
                      >
                        {tool.monthlySavings > 0 ? `${tool.recommendationType} recommendation` : 'keep current'}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-slate-300">{tool.reason}</p>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Current</p>
                        <p className="mt-2 text-lg font-semibold">
                          {tool.currentToolName} {tool.currentPlan}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{formatCurrency(tool.currentMonthlySpend)}/mo</p>
                      </div>

                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Recommended</p>
                        <p className="mt-2 text-lg font-semibold">
                          {tool.recommendedToolName ?? tool.currentToolName} {tool.recommendedPlan ?? tool.currentPlan}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{formatCurrency(tool.recommendedMonthlySpend)}/mo</p>
                      </div>

                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Savings</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-300">{formatCurrency(tool.monthlySavings)}/mo</p>
                        <p className="mt-1 text-sm text-slate-300">{formatCurrency(tool.annualSavings)}/yr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
