export function AuditResults({ onBack }) {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <button onClick={onBack} className="mb-6 text-credex-light hover:underline">
          Back to Audit
        </button>
        <h1 className="mb-8 text-4xl font-bold">Your Audit Results</h1>
        <p className="text-slate-600">Results coming in Day 3</p>
      </div>
    </div>
  )
}
