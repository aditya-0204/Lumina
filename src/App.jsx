import { useEffect, useState } from 'react'
import { AuditForm } from './components/AuditForm'
import { AuditResults } from './components/AuditResults'
import { LandingPage } from './pages/LandingPage'
import { calculateAudit } from './services/auditService'
import { generateExecutiveSummary } from './services/summaryService'
import { getSharedAudit } from './services/shareService'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareId = params.get('share')
    if (!shareId) return

    const sharedAudit = getSharedAudit(shareId)
    if (!sharedAudit) return

    setShowAudit(true)
    setAuditData({ tools: {} })
    setResults(sharedAudit)
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

  if (!showAudit) {
    return <LandingPage onStartAudit={handleStartAudit} />
  }

  if (results) {
    return <AuditResults data={results} auditData={auditData} onBack={handleBackHome} onEdit={handleEditAudit} />
  }

  return <AuditForm onSubmit={handleAuditSubmit} onBack={handleBackHome} isSubmitting={isSubmitting} />
}

export default App
