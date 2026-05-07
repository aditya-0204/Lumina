export function AuditResults({ data, auditData, onBack }) {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={onBack} className="text-credex-light hover:underline mb-6">
          ← Back to Audit
        </button>
        <h1 className="text-4xl font-bold mb-8">Your Audit Results</h1>
        <p className="text-slate-600">Results coming in Day 3</p>
      </div>
    </div>
  )
}
