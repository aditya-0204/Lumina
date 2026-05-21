import { useEffect, useState } from 'react'
import { AuditForm } from './components/AuditForm'
import { AuditResults } from './components/AuditResults'
import { ReauditDiffView } from './components/ReauditDiffView'
import { LandingPage } from './pages/LandingPage'
import { calculateAudit } from './services/auditService'
import { persistCompletedAudit } from './services/auditPersistenceService'
import { generateExecutiveSummary } from './services/summaryService'
import { resolveSharedAudit } from './services/shareService'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [results, setResults] = useState(null)
  const [reauditResults, setReauditResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shareLoadState, setShareLoadState] = useState('idle')
  const [reauditLoadState, setReauditLoadState] = useState('idle')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reAuditId = params.get('reaudit')
    const shareId = params.get('share')

    if (reAuditId) {
      const loadReaudit = async () => {
        setReauditLoadState('loading')

        try {
          const response = await fetch(`/api/reaudit?id=${encodeURIComponent(reAuditId)}`)

          if (!response.ok) {
            setReauditLoadState('missing')
            return
          }

          const payload = await response.json()
          setShowAudit(true)
          setAuditData(payload.audit.inputStack)
          setReauditResults(payload)
          setReauditLoadState('loaded')
        } catch {
          setReauditLoadState('missing')
        }
      }

      loadReaudit()
      return
    }

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
    setReauditResults(null)
  }

  const handleAuditSubmit = async (data) => {
    setIsSubmitting(true)
    setAuditData(data)
    const auditResults = calculateAudit(data)
    const executiveSummary = await generateExecutiveSummary(auditResults, data)
    const completeResults = { ...auditResults, executiveSummary }
    await persistCompletedAudit({
      email: data.email,
      auditInput: data,
      auditResults: completeResults,
    })
    setResults(completeResults)
    setIsSubmitting(false)
  }

  const handleEditAudit = () => {
    setResults(null)
    setReauditResults(null)
  }

  const handleBackHome = () => {
    window.history.replaceState({}, '', window.location.pathname)
    setShowAudit(false)
    setAuditData(null)
    setResults(null)
    setReauditResults(null)
    setIsSubmitting(false)
    setShareLoadState('idle')
    setReauditLoadState('idle')
  }

  if (reauditLoadState === 'loading') {
    return <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-white">Loading re-audit diff...</div>
  }

  if (reauditLoadState === 'missing') {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-white">
        <h1 className="text-3xl font-semibold">Stored audit not found</h1>
        <p className="mt-3 text-slate-300">That re-audit link is no longer available. You can start a new audit instead.</p>
        <button
          onClick={handleBackHome}
          className="mt-6 rounded-xl bg-credex-light px-5 py-3 font-semibold text-black transition hover:bg-emerald-500"
        >
          Back Home
        </button>
      </div>
    )
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

  if (reauditResults) {
    return <ReauditDiffView data={reauditResults} onBack={handleBackHome} />
  }

  return <AuditForm onSubmit={handleAuditSubmit} onBack={handleBackHome} isSubmitting={isSubmitting} />
}

export default App
