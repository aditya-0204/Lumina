import { useState } from 'react'
import { AuditForm } from './components/AuditForm'
import { AuditResults } from './components/AuditResults'
import { LandingPage } from './pages/LandingPage'
import { calculateAudit } from './services/auditService'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [results, setResults] = useState(null)

  const handleStartAudit = () => {
    setShowAudit(true)
    setResults(null)
  }

  const handleAuditSubmit = (data) => {
    setAuditData(data)
    // Calculate audit results immediately
    const auditResults = calculateAudit(data)
    setResults(auditResults)
  }

  const handleBackHome = () => {
    setShowAudit(false)
    setAuditData(null)
    setResults(null)
  }

  if (!showAudit) {
    return <LandingPage onStartAudit={handleStartAudit} />
  }

  if (results) {
    return <AuditResults data={results} auditData={auditData} onBack={handleBackHome} />
  }

  return <AuditForm onSubmit={handleAuditSubmit} />
}

export default App
