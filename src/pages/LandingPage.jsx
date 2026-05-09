export function LandingPage({ onStartAudit }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-credex-dark via-slate-900 to-credex-dark text-white">
      <nav className="sticky top-0 z-40 border-b border-slate-700/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-credex-light">Lumina</h1>
          <a href="#" className="text-slate-300 transition hover:text-white">
            About
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Your AI spending, <span className="text-credex-light">audited</span>
          </h2>
          <p className="mb-8 text-xl text-slate-300">
            See exactly where your team is overspending on AI tools. Get instant recommendations to cut costs and
            discover Credex credits when savings are significant.
          </p>
          <button
            onClick={onStartAudit}
            className="rounded-lg bg-credex-light px-8 py-3 text-lg font-semibold text-black transition hover:bg-emerald-600"
          >
            Start Free Audit
          </button>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-2 text-lg font-semibold">Instant Analysis</h3>
            <p className="text-slate-400">See your spending breakdown across all AI tools in seconds</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-2 text-lg font-semibold">Savings Opportunities</h3>
            <p className="text-slate-400">Discover how much you could save with better plan choices</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-2 text-lg font-semibold">Shareable Reports</h3>
            <p className="text-slate-400">Get a unique URL to share audit results with your team</p>
          </div>
        </div>
      </section>

      <footer className="mt-20 border-t border-slate-700/50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-400">
          <p>Credex 2026 | Powered by credex.rocks</p>
        </div>
      </footer>
    </div>
  )
}
