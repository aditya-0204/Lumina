import { useState } from 'react'
import { AuditForm } from './components/AuditForm'
import { AuditResults } from './components/AuditResults'
import { LandingPage } from './pages/LandingPage'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState(null)
  const [results, setResults] = useState(null)

  const handleStartAudit = () => {
    setShowAudit(true)
    setResults(null)
  }

  const handleAuditSubmit = async (data) => {
    setAuditData(data)
    // Call audit engine
    const response = await calculateAudit(data)
    setResults(response)
  }

  const handleBackHome = () => {
    setShowAudit(false)
    setAuditData(null)
    setResults(null)
  }

  async function calculateAudit(data) {
    // Placeholder - will be implemented in Day 2
    return {}
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
