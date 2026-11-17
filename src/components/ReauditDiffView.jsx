import { useMemo, useState } from 'react'

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

const describeRecommendation = (tool) => {
  if (!tool) return 'Unavailable'

  if (tool.recommendationType === 'keep') {
    return `Keep ${tool.toolName} ${tool.currentPlan}`
  }

  const targetTool = tool.recommendedToolName ?? tool.toolName
  const targetPlan = tool.recommendedPlan ?? tool.currentPlan
  return `${targetTool} ${targetPlan}`
}

export function ReauditDiffView({ data, onBack }) {
  const [showUnchangedRows, setShowUnchangedRows] = useState(false)

  const visibleToolDiffs = useMemo(() => {
    return showUnchangedRows ? data.diff.changedTools : data.diff.changedTools.filter((item) => item.changed)
  }, [data.diff.changedTools, showUnchangedRows])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-12 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Audit Comparison</p>
            <h1 className="mt-2 text-4xl font-bold">Pricing changes affected this audit</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Audit <span className="font-mono text-slate-200">{data.audit.id}</span> was originally saved on{' '}
              {new Date(data.audit.createdAt).toLocaleString()}.
            </p>
          </div>
          <button
            onClick={onBack}
            className="rounded-xl bg-credex-light px-4 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500"
          >
            Back Home
          </button>
        </div>

        <section className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100/80">Headline Change</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">
                Savings delta: {formatCurrency(data.diff.totalMonthlySavingsDelta)} / month
              </h2>
              <p className="mt-3 max-w-3xl text-slate-200">
                Previous monthly savings estimate was {formatCurrency(data.previousResult.totalMonthlySavings)}. The current
                pricing model now estimates {formatCurrency(data.currentResult.totalMonthlySavings)}.
              </p>
            </div>
            <div className="rounded-2xl bg-black/20 px-5 py-4">
              <p className="text-sm text-slate-400">Annual delta</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-200">
                {formatCurrency(data.diff.totalAnnualSavingsDelta)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Original Audit</p>
            <h2 className="mt-3 text-2xl font-semibold">Saved recommendation</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Monthly savings</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.previousResult.totalMonthlySavings)}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Annual savings</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.previousResult.totalAnnualSavings)}</p>
              </div>
            </div>
            <p className="mt-5 text-slate-300">{data.previousResult.summary}</p>
          </article>

          <article className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100/80">Current Audit</p>
            <h2 className="mt-3 text-2xl font-semibold">Recommendation after repricing</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/40 p-4">
                <p className="text-sm text-slate-300">Monthly savings</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.currentResult.totalMonthlySavings)}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/40 p-4">
                <p className="text-sm text-slate-300">Annual savings</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.currentResult.totalAnnualSavings)}</p>
              </div>
            </div>
            <p className="mt-5 text-slate-200">{data.currentResult.summary}</p>
          </article>
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/5 to-emerald-300/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/80">Pricing Updates</p>
              <h2 className="mt-3 text-2xl font-semibold">What changed in the catalog</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowUnchangedRows((prev) => !prev)}
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {showUnchangedRows ? 'Hide unchanged rows' : 'Show unchanged rows'}
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {data.pricingChanges.length > 0 ? (
              data.pricingChanges.map((change) => (
                <div key={`${change.toolKey}-${change.plan}-${change.type}`} className="rounded-2xl bg-black/20 px-4 py-3">
                  <p className="font-medium">
                    {change.toolKey} {change.plan}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {change.type === 'added'
                      ? `Added at ${formatCurrency(change.nextMonthly ?? 0)}/mo`
                      : change.type === 'removed'
                        ? `Removed from the pricing catalog`
                        : `${formatCurrency(change.previousMonthly ?? 0)}/mo -> ${formatCurrency(change.nextMonthly ?? 0)}/mo`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-300">The recommendation changed even though the pricing snapshot diff is empty.</p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recommendation Changes By Tool</h2>
            <p className="text-sm text-slate-400">{visibleToolDiffs.length} rows shown</p>
          </div>

          <div className="space-y-4">
            {visibleToolDiffs.map((item) => (
              <article
                key={item.toolKey}
                className={`rounded-3xl border p-6 ${
                  item.changed ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold">{item.previousTool?.toolName ?? item.nextTool?.toolName}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                          item.changed ? 'bg-emerald-400/15 text-emerald-200' : 'bg-slate-200/10 text-slate-300'
                        }`}
                      >
                        {item.changed ? 'changed' : 'unchanged'}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Previous recommendation</p>
                        <p className="mt-2 text-lg font-semibold">{describeRecommendation(item.previousTool)}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {formatCurrency(item.previousTool?.monthlySavings ?? 0)} savings / month
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Current recommendation</p>
                        <p className="mt-2 text-lg font-semibold">{describeRecommendation(item.nextTool)}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {formatCurrency(item.nextTool?.monthlySavings ?? 0)} savings / month
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-950/50 p-4">
                        <p className="text-sm text-slate-400">Delta</p>
                        <p className="mt-2 text-lg font-semibold text-emerald-300">
                          {formatCurrency((item.nextTool?.monthlySavings ?? 0) - (item.previousTool?.monthlySavings ?? 0))}
                          /mo
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{item.nextTool?.reason ?? item.previousTool?.reason}</p>
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
