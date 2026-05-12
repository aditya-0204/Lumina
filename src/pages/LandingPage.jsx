const featureCards = [
  {
    title: 'Instant Analysis',
    body: 'See how much your team is spending today and where the clearest savings are hiding.',
  },
  {
    title: 'Plan Fit Checks',
    body: 'Spot seats or plans that no longer match your team size and use case.',
  },
  {
    title: 'Shareable Reports',
    body: 'Create a safe audit link you can send to a founder, finance lead, or engineering manager.',
  },
]

const proofPoints = ['8 supported AI tools', 'Per-tool savings breakdown', 'PII-safe shared audit links']

export function LandingPage({ onStartAudit }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_28%),linear-gradient(180deg,#062c2b_0%,#081a1f_55%,#031015_100%)] text-white">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/35 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-2xl font-bold text-emerald-300">Lumina</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">AI Spend Visibility</p>
          </div>
          <button
            onClick={onStartAudit}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Open Audit
          </button>
        </div>
      </nav>

      <main className="relative">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200">
              Built for startup teams managing fast-growing AI spend
            </div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white md:text-7xl">
              See where your AI stack is
              <span className="block text-emerald-300"> quietly leaking budget.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Lumina reviews tool plans, team size, and current spend to surface savings opportunities you can explain
              to finance in minutes.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onStartAudit}
                className="rounded-2xl bg-emerald-300 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-200"
              >
                Start Free Audit
              </button>
              <a
                href="#how-it-works"
                className="rounded-2xl border border-white/15 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-emerald-300/15 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Sample Snapshot</p>
                  <h2 className="mt-2 text-2xl font-semibold">Audit overview</h2>
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm font-medium text-emerald-200">
                  Team of 6
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/35 p-4">
                  <p className="text-sm text-slate-400">Current Spend</p>
                  <p className="mt-3 text-3xl font-semibold">$418/mo</p>
                </div>
                <div className="rounded-2xl bg-emerald-300/10 p-4">
                  <p className="text-sm text-emerald-100/70">Potential Savings</p>
                  <p className="mt-3 text-3xl font-semibold text-emerald-300">$124/mo</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">ChatGPT Team</p>
                      <p className="mt-1 text-sm text-slate-400">Recommend switching to Claude Pro</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-300">Save $60/mo</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">Cursor Business</p>
                      <p className="mt-1 text-sm text-slate-400">Recommend moving to Pro</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-300">Save $40/mo</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/6 p-4 text-sm leading-7 text-slate-300">
                Best next step: standardize plan selection before headcount grows further. The biggest savings are coming
                from two tools, not across the entire stack.
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">How It Works</p>
                <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em]">A simple path from spend input to action</h2>
              </div>
              <p className="max-w-xl text-slate-300">
                The audit takes just a few minutes and gives you totals, recommendations, a written summary, and a link
                you can share internally.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featureCards.map((card, index) => (
                <div key={card.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/30 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-16 max-w-7xl px-6 pb-10">
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Lumina</p>
          <p>Built for teams trying to bring AI software spend under control.</p>
        </div>
      </footer>
    </div>
  )
}
