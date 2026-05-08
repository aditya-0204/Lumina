import { useEffect, useMemo, useState } from 'react'
import { FORM_STORAGE_KEY, TEAM_SIZE_RANGES, TOOLS, USE_CASES } from '../constants/tools'
import { getMonthlyPrice, getPricingMeta, isPricePerUser } from '../services/pricingService'
import { validateAuditForm } from '../utils/validators'

const createEmptyForm = () => ({
  tools: {},
  teamSize: '',
  useCase: 'Mixed',
})

const normalizeLoadedForm = (savedForm) => {
  const rawTools = savedForm?.tools && typeof savedForm.tools === 'object' ? savedForm.tools : {}

  const tools = Object.fromEntries(
    Object.entries(rawTools)
      .filter(([toolKey]) => TOOLS[toolKey])
      .map(([toolKey, toolValue]) => {
        const defaultPlan = TOOLS[toolKey].defaultPlan
        const plan = TOOLS[toolKey].plans.includes(toolValue?.plan) ? toolValue.plan : defaultPlan

        return [
          toolKey,
          {
            plan,
            spend: toolValue?.spend ?? '',
            seats: Number.isInteger(toolValue?.seats) && toolValue.seats > 0 ? toolValue.seats : 1,
          },
        ]
      }),
  )

  return {
    ...createEmptyForm(),
    ...savedForm,
    tools,
    teamSize: TEAM_SIZE_RANGES.some((range) => range.value === savedForm?.teamSize)
      ? savedForm.teamSize
      : '',
    useCase: USE_CASES.includes(savedForm?.useCase) ? savedForm.useCase : 'Mixed',
  }
}

export function AuditForm({ onSubmit }) {
  const [formData, setFormData] = useState(createEmptyForm)
  const [errors, setErrors] = useState({})
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY)
    if (saved) {
      try {
        setFormData(normalizeLoadedForm(JSON.parse(saved)))
      } catch (error) {
        console.error('Failed to load saved form data:', error)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
  }, [formData, isHydrated])

  const selectedToolCount = Object.keys(formData.tools).length
  const selectedTools = useMemo(
    () =>
      Object.entries(formData.tools).map(([toolKey, toolData]) => ({
        toolKey,
        tool: TOOLS[toolKey],
        toolData,
        monthlyListPrice: getMonthlyPrice(toolKey, toolData.plan),
        pricingMeta: getPricingMeta(toolKey, toolData.plan),
      })),
    [formData.tools],
  )

  const resetForm = () => {
    setFormData(createEmptyForm())
    setErrors({})
    localStorage.removeItem(FORM_STORAGE_KEY)
  }

  const handleToolToggle = (toolKey) => {
    setFormData((prev) => {
      const nextTools = { ...prev.tools }

      if (nextTools[toolKey]) {
        delete nextTools[toolKey]
      } else {
        const defaultPlan = TOOLS[toolKey].defaultPlan
        nextTools[toolKey] = {
          plan: defaultPlan,
          spend: getMonthlyPrice(toolKey, defaultPlan) ?? '',
          seats: 1,
        }
      }

      return {
        ...prev,
        tools: nextTools,
      }
    })
  }

  const handleToolChange = (toolKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [toolKey]: {
          ...prev.tools[toolKey],
          [field]: value,
        },
      },
    }))
  }

  const handlePlanChange = (toolKey, plan) => {
    setFormData((prev) => {
      const monthlyPrice = getMonthlyPrice(toolKey, plan)

      return {
        ...prev,
        tools: {
          ...prev.tools,
          [toolKey]: {
            ...prev.tools[toolKey],
            plan,
            spend: monthlyPrice ?? prev.tools[toolKey].spend,
          },
        },
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateAuditForm(formData)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-credex-dark/70">Day 2 Intake</p>
            <h1 className="mb-2 text-4xl font-bold text-slate-900">Analyze Your Spending</h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Tell us which AI tools your team pays for, the plan you are on, and what you spend each month.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white/90 px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-500">Progress saved locally</p>
            <p className="text-2xl font-semibold text-slate-900">{selectedToolCount} tools selected</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">1. Which AI tools does your team use?</h2>
            <p className="mb-6 text-slate-600">
              Pick every tool you actively pay for today. We will use your entered monthly spend as the source of truth.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(TOOLS).map(([key, tool]) => (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 transition ${
                    formData.tools[key]
                      ? 'border-emerald-400 bg-emerald-50/60'
                      : 'border-slate-300 bg-white hover:border-credex-light'
                  }`}
                >
                  <label className="flex cursor-pointer items-start">
                    <input
                      type="checkbox"
                      checked={!!formData.tools[key]}
                      onChange={() => handleToolToggle(key)}
                      className="mt-1 h-4 w-4 text-credex-light"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-slate-900">{tool.name}</div>
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
                          {tool.category}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{tool.description}</div>
                    </div>
                  </label>

                  {formData.tools[key] && (
                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Plan</label>
                        <select
                          value={formData.tools[key].plan}
                          onChange={(event) => handlePlanChange(key, event.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
                        >
                          {tool.plans.map((plan) => (
                            <option key={plan} value={plan}>
                              {plan}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Monthly Spend ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.tools[key].spend}
                          onChange={(event) =>
                            handleToolChange(
                              key,
                              'spend',
                              event.target.value === '' ? '' : Number(event.target.value),
                            )
                          }
                          placeholder="0.00"
                          className={`w-full rounded-md border bg-white px-3 py-2 text-slate-900 ${
                            errors[`spend_${key}`] ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors[`spend_${key}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`spend_${key}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Number of Seats</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.tools[key].seats}
                          onChange={(event) =>
                            handleToolChange(
                              key,
                              'seats',
                              event.target.value === '' ? '' : Number.parseInt(event.target.value, 10),
                            )
                          }
                          className={`w-full rounded-md border bg-white px-3 py-2 text-slate-900 ${
                            errors[`seats_${key}`] ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors[`seats_${key}`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`seats_${key}`]}</p>
                        )}
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {getMonthlyPrice(key, formData.tools[key].plan) !== null
                          ? `Reference list price: $${getMonthlyPrice(key, formData.tools[key].plan)}${
                              isPricePerUser(key, formData.tools[key].plan) ? ' per seat' : ' per month'
                            }`
                          : 'Reference list price unavailable for this plan'}
                        {getPricingMeta(key, formData.tools[key].plan)?.note && (
                          <span className="mt-1 block text-slate-500">
                            {getPricingMeta(key, formData.tools[key].plan).note}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.tools && <p className="mt-3 text-sm text-red-600">{errors.tools}</p>}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">2. Team Context</h2>

              <div className="mb-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Team Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {TEAM_SIZE_RANGES.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, teamSize: range.value }))}
                      className={`rounded-lg px-4 py-3 font-medium transition ${
                        formData.teamSize === range.value
                          ? 'bg-credex-light text-black'
                          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {errors.teamSize && <p className="mt-3 text-sm text-red-600">{errors.teamSize}</p>}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Primary Use Case</h3>
                <div className="grid grid-cols-2 gap-3">
                  {USE_CASES.map((useCase) => (
                    <button
                      key={useCase}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, useCase }))}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                        formData.useCase === useCase
                          ? 'bg-credex-light text-black'
                          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                      }`}
                    >
                      {useCase}
                    </button>
                  ))}
                </div>
                {errors.useCase && <p className="mt-3 text-sm text-red-600">{errors.useCase}</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Audit Preview</h2>
              <div className="space-y-3 text-sm text-slate-300">
                <p>{selectedToolCount} tools selected</p>
                <p>{formData.teamSize ? `Team size bucket: ${formData.teamSize}` : 'Team size not selected yet'}</p>
                <p>{formData.useCase ? `Primary use case: ${formData.useCase}` : 'Use case not selected yet'}</p>
              </div>

              <div className="mt-5 space-y-2">
                {selectedTools.length > 0 ? (
                  selectedTools.map(({ toolKey, tool, toolData, monthlyListPrice, pricingMeta }) => (
                    <div key={toolKey} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <div>
                        <p className="font-medium text-white">{tool.name}</p>
                        <p className="text-xs text-slate-400">{toolData.plan}</p>
                      </div>
                      <p className="text-sm text-emerald-300">
                        ${toolData.spend === '' ? monthlyListPrice ?? 0 : toolData.spend}
                        {pricingMeta?.perUser ? '/seat' : '/mo'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Select a tool to start building the audit input.</p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-credex-light px-4 py-3 text-lg font-semibold text-black transition hover:bg-emerald-600"
                >
                  Get Your Audit Results
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Clear Saved Progress
                </button>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  )
}
