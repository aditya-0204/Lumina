const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

const getPrimaryOpportunity = (auditResults) => {
  return auditResults.tools.find((tool) => tool.monthlySavings > 0) ?? auditResults.tools[0]
}

const canUseApi = () => typeof fetch === 'function'

export const buildFallbackSummary = (auditResults, auditData) => {
  const primaryOpportunity = getPrimaryOpportunity(auditResults)
  const toolCount = Object.keys(auditData.tools).length
  const monthlySavings = formatCurrency(auditResults.totalMonthlySavings)
  const annualSavings = formatCurrency(auditResults.totalAnnualSavings)

  if (!primaryOpportunity || auditResults.totalMonthlySavings <= 0) {
    return `Lumina reviewed ${toolCount} tools for your ${auditResults.teamSize.estimate}-person team. Right now, your stack looks fairly aligned with your ${auditResults.useCase.toLowerCase()} workflow, so there are no major overspend flags. The next step is usually tightening usage policy, consolidating overlapping seats, and reviewing API spend monthly so costs stay predictable as adoption grows.`
  }

  const recommendationLabel =
    primaryOpportunity.recommendationType === 'switch'
      ? `${primaryOpportunity.recommendedToolName} ${primaryOpportunity.recommendedPlan}`
      : `${primaryOpportunity.toolName} ${primaryOpportunity.recommendedPlan}`

  return `Lumina reviewed ${toolCount} tools for your ${auditResults.teamSize.estimate}-person team and found about ${monthlySavings} in monthly savings, or ${annualSavings} annually. The clearest win is moving ${primaryOpportunity.toolName} to ${recommendationLabel}. That change alone addresses the biggest source of overspend while keeping your ${auditResults.useCase.toLowerCase()} workflow intact. After that, you should standardize plan selection across the rest of the stack and revisit pricing as seat count changes.`
}

export const generateExecutiveSummary = async (auditResults, auditData) => {
  const content = buildFallbackSummary(auditResults, auditData)

  if (!canUseApi()) {
    return {
      content,
      source: 'template',
    }
  }

  try {
    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auditResults,
        auditData,
      }),
    })

    if (!response.ok) {
      throw new Error('Summary request failed')
    }

    const payload = await response.json()

    if (!payload.content?.trim()) {
      throw new Error('Summary response was empty')
    }

    return {
      content: payload.content,
      source: payload.source ?? 'api',
    }
  } catch {
    return {
      content,
      source: 'template',
    }
  }
}
