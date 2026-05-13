import { useEffect, useState } from 'react'
import { AuditForm } from './components/AuditForm'
import { AuditResults } from './components/AuditResults'
import { LandingPage } from './pages/LandingPage'
import { calculateAudit } from './services/auditService'
import { generateExecutiveSummary } from './services/summaryService'
import { resolveSharedAudit } from './services/shareService'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareLoadState, setShareLoadState] = useState('idle')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareId = params.get('share')
    if (!shareId) return

    const loadSharedAudit = async () => {
      setShareLoadState('loading')
      const sharedAudit = await resolveSharedAudit(shareId)

      if (!sharedAudit) {
        setShareLoadState('missing')
        return
      }

      setShowAudit(true)
      setAuditData({ tools: {} })
      setResults(sharedAudit)
      setShareLoadState('loaded')
    }

    loadSharedAudit()
  }, [])

  const handleStartAudit = () => {
    setShowAudit(true)
    setResults(null)
  }

  const handleAuditSubmit = async (data) => {
    setIsSubmitting(true)
    setAuditData(data)
    const auditResults = calculateAudit(data)
    const executiveSummary = await generateExecutiveSummary(auditResults, data)
    setResults({ ...auditResults, executiveSummary })
    setIsSubmitting(false)
  }

  const handleEditAudit = () => {
    setResults(null)
  }

  const handleBackHome = () => {
    window.history.replaceState({}, '', window.location.pathname)
    setShowAudit(false)
    setAuditData(null)
    setResults(null)
    setIsSubmitting(false)
  }

  if (shareLoadState === 'loading') {
    return <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-white">Loading shared audit...</div>
  }

  if (shareLoadState === 'missing') {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-white">
        <h1 className="text-3xl font-semibold">Shared audit not found</h1>
        <p className="mt-3 text-slate-300">That link is no longer available. You can start a new audit instead.</p>
        <button
          onClick={handleBackHome}
          className="mt-6 rounded-xl bg-credex-light px-5 py-3 font-semibold text-black transition hover:bg-emerald-500"
        >
          Back Home
        </button>
      </div>
    )
  }

  if (!showAudit) {
    return <LandingPage onStartAudit={handleStartAudit} />
  }

  if (results) {
    return <AuditResults data={results} auditData={auditData} onBack={handleBackHome} onEdit={handleEditAudit} />
  }

  return <AuditForm onSubmit={handleAuditSubmit} onBack={handleBackHome} isSubmitting={isSubmitting} />
}

export default App
