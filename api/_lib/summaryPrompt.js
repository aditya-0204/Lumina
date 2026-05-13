export function buildSummaryPrompt(auditResults, auditData) {
  const toolRows = auditResults.tools
    .map((tool) => {
      const recommendation = tool.monthlySavings > 0
        ? `${tool.recommendedToolName ?? tool.currentToolName} ${tool.recommendedPlan ?? tool.currentPlan}`
        : 'Keep current'

      return [
        `Tool: ${tool.toolName}`,
        `Current plan: ${tool.currentPlan}`,
        `Current monthly spend: $${tool.currentMonthlySpend}`,
        `Recommendation: ${recommendation}`,
        `Monthly savings: $${tool.monthlySavings}`,
        `Reason: ${tool.reason}`,
      ].join('\n')
    })
    .join('\n\n')

  return [
    'You are writing a concise executive summary for an AI spend audit.',
    'Write 90 to 120 words.',
    'Sound specific and practical, not promotional.',
    'Mention the monthly and annual savings totals.',
    'Mention the strongest recommendation.',
    'If savings are below $100/month, say the stack is already in good shape and suggest light ongoing review.',
    'Do not use bullet points.',
    '',
    `Team size range: ${auditResults.teamSize.range}`,
    `Estimated team size: ${auditResults.teamSize.estimate}`,
    `Primary use case: ${auditResults.useCase}`,
    `Tools audited: ${Object.keys(auditData.tools || {}).length}`,
    `Total monthly spend: $${auditResults.totalMonthlySpend}`,
    `Total monthly savings: $${auditResults.totalMonthlySavings}`,
    `Total annual savings: $${auditResults.totalAnnualSavings}`,
    '',
    toolRows,
  ].join('\n')
}
