import { useState } from 'react'

export function AuditForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    tools: {},
    teamSize: '',
    useCase: 'mixed'
  })

  const handleToolChange = (tool, field, value) => {
    setFormData(prev => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: {
          ...prev.tools[tool],
          [field]: value
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">AI Spending Audit</h1>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData) }}>
          {/* Placeholder for form fields - will be fully built in Day 2 */}
          <p className="text-slate-600">Form fields coming in Day 2</p>
          <button type="submit" className="mt-6 bg-credex-light text-black px-6 py-2 rounded">
            Get Audit Results
          </button>
        </form>
      </div>
    </div>
  )
}
