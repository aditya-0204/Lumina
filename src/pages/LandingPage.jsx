export function LandingPage({ onStartAudit }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-credex-dark via-slate-900 to-credex-dark text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-credex-light">SpendAudit</h1>
          <a href="#" className="text-slate-300 hover:text-white transition">About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your AI spending, <span className="text-credex-light">audited</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            See exactly where your team is overspending on AI tools. Get instant recommendations to cut costs—and discover Credex credits when savings are significant.
          </p>
          <button
            onClick={onStartAudit}
            className="bg-credex-light hover:bg-emerald-600 text-black font-semibold py-3 px-8 rounded-lg transition text-lg"
          >
            Start Free Audit
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
            <p className="text-slate-400">See your spending breakdown across all AI tools in seconds</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold mb-2">Savings Opportunities</h3>
            <p className="text-slate-400">Discover how much you could save with better plan choices</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold mb-2">Shareable Reports</h3>
            <p className="text-slate-400">Get a unique URL to share audit results with your team</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>Credex © 2026 | Powered by credex.rocks</p>
        </div>
      </footer>
    </div>
  )
}
