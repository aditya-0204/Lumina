import { getMonthlyPrice, isPricePerUser } from './pricingService'
import { TOOLS } from '../constants/tools'

const TEAM_SIZE_ESTIMATES = {
  small: 3,
  medium: 10,
  large: 30,
  enterprise: 100,
}

const PLAN_FIT_RULES = {
  cursor: {
    small: 'Pro',
    medium: 'Business',
    large: 'Business',
    enterprise: 'Enterprise',
  },
  copilot: {
    small: 'Individual',
    medium: 'Business',
    large: 'Business',
    enterprise: 'Enterprise',
  },
  claude: {
    small: 'Pro',
    medium: 'Team',
    large: 'Team',
    enterprise: 'Enterprise',
  },
  chatgpt: {
    small: 'Plus',
    medium: 'Team',
    large: 'Team',
    enterprise: 'Enterprise',
  },
  gemini: {
    small: 'Pro',
    medium: 'Pro',
    large: 'Ultra',
    enterprise: 'Ultra',
  },
  windsurf: {
    small: 'Pro',
    medium: 'Pro',
    large: 'Pro',
    enterprise: 'Pro',
  },
}

const USE_CASE_ALTERNATIVES = {
  Coding: {
    chatgpt: [{ toolKey: 'claude', plan: 'Pro', reason: 'Claude Pro is often a cheaper primary coding copilot for small teams.' }],
    copilot: [{ toolKey: 'cursor', plan: 'Pro', reason: 'Cursor Pro can replace a separate coding assistant seat in many teams.' }],
    windsurf: [{ toolKey: 'cursor', plan: 'Pro', reason: 'Cursor Pro is a comparable coding tool with a predictable seat cost.' }],
  },
  Writing: {
    claude: [{ toolKey: 'gemini', plan: 'Pro', reason: 'Gemini Pro can cover everyday writing workflows at a slightly lower list price.' }],
    chatgpt: [{ toolKey: 'gemini', plan: 'Pro', reason: 'Gemini Pro may handle general writing tasks at a lower recurring cost.' }],
  },
  Data: {
    chatgpt: [{ toolKey: 'gemini', plan: 'Pro', reason: 'Gemini Pro can handle lightweight data and analysis workflows at a lower monthly cost.' }],
  },
  Research: {
    chatgpt: [{ toolKey: 'claude', plan: 'Pro', reason: 'Claude Pro is often strong enough for research workflows at a lower monthly cost.' }],
  },
  Mixed: {
    chatgpt: [{ toolKey: 'claude', plan: 'Pro', reason: 'Claude Pro can cover mixed knowledge work at a lower list price for many teams.' }],
  },
}

export const calculateAudit = (formData) => {
  const { tools: userTools, teamSize, useCase } = formData
  const teamSizeEstimate = TEAM_SIZE_ESTIMATES[teamSize] || 10

  const toolAnalyses = Object.entries(userTools).map(([toolKey, toolData]) =>
    analyzeToolSpend(toolKey, toolData, teamSize, teamSizeEstimate, useCase),
  )

  const totalMonthlySpend = toolAnalyses.reduce((sum, tool) => sum + tool.currentMonthlySpend, 0)
  const totalAnnualSpend = totalMonthlySpend * 12
  const totalMonthlySavings = toolAnalyses.reduce((sum, tool) => sum + tool.monthlySavings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12
  const recommendations = toolAnalyses
    .filter((tool) => tool.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)

  return {
    auditId: generateAuditId(),
    timestamp: new Date().toISOString(),
    teamSize: { range: teamSize, estimate: teamSizeEstimate },
    useCase,
    tools: toolAnalyses.sort((a, b) => b.monthlySavings - a.monthlySavings),
    totalMonthlySpend,
    totalAnnualSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
    summary: buildAuditSummary(totalMonthlySavings, recommendations),
  }
}

function analyzeToolSpend(toolKey, toolData, teamSizeRange, teamSizeEstimate, useCase) {
  const tool = TOOLS[toolKey]
  const seats = Number.parseInt(toolData.seats, 10) || 1
  const currentMonthlySpend = Number(toolData.spend) || 0
  const currentAnnualSpend = currentMonthlySpend * 12

  const candidates = [
    buildSameVendorCandidate(toolKey, toolData.plan, teamSizeRange, seats, currentMonthlySpend, teamSizeEstimate),
    ...buildAlternativeCandidates(toolKey, useCase, seats, currentMonthlySpend),
  ].filter(Boolean)

  const bestCandidate = candidates
    .filter((candidate) => candidate.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  if (!bestCandidate) {
    return {
      toolKey,
      toolName: tool.name,
      currentPlan: toolData.plan,
      currentToolName: tool.name,
      currentMonthlySpend,
      currentAnnualSpend,
      recommendedMonthlySpend: currentMonthlySpend,
      recommendedAnnualSpend: currentAnnualSpend,
      monthlySavings: 0,
      annualSavings: 0,
      recommendationType: 'keep',
      reason: `Current ${tool.name} setup already looks reasonable for a ${teamSizeEstimate}-person team.`,
    }
  }

  return {
    toolKey,
    toolName: tool.name,
    currentPlan: toolData.plan,
    currentToolName: tool.name,
    currentMonthlySpend,
    currentAnnualSpend,
    recommendedPlan: bestCandidate.recommendedPlan,
    recommendedToolKey: bestCandidate.recommendedToolKey,
    recommendedToolName: bestCandidate.recommendedToolName,
    recommendedMonthlySpend: bestCandidate.recommendedMonthlySpend,
    recommendedAnnualSpend: bestCandidate.recommendedMonthlySpend * 12,
    monthlySavings: bestCandidate.monthlySavings,
    annualSavings: bestCandidate.monthlySavings * 12,
    recommendationType: bestCandidate.type,
    reason: bestCandidate.reason,
  }
}

function buildSameVendorCandidate(toolKey, currentPlan, teamSizeRange, seats, currentMonthlySpend, teamSizeEstimate) {
  const recommendedPlan = PLAN_FIT_RULES[toolKey]?.[teamSizeRange]
  if (!recommendedPlan || recommendedPlan === currentPlan) return null

  const recommendedMonthlySpend = calculatePlanCost(toolKey, recommendedPlan, seats)
  if (recommendedMonthlySpend === null) return null

  return {
    type: 'plan',
    recommendedPlan,
    recommendedToolKey: toolKey,
    recommendedToolName: TOOLS[toolKey].name,
    recommendedMonthlySpend,
    monthlySavings: roundCurrency(currentMonthlySpend - recommendedMonthlySpend),
    reason: `${TOOLS[toolKey].name} ${recommendedPlan} is a better fit for a ${teamSizeEstimate}-person team than ${currentPlan}.`,
  }
}

function buildAlternativeCandidates(toolKey, useCase, seats, currentMonthlySpend) {
  const alternatives = USE_CASE_ALTERNATIVES[useCase]?.[toolKey] ?? []

  return alternatives
    .map((alternative) => {
      const recommendedMonthlySpend = calculatePlanCost(alternative.toolKey, alternative.plan, seats)
      if (recommendedMonthlySpend === null) return null

      return {
        type: 'switch',
        recommendedPlan: alternative.plan,
        recommendedToolKey: alternative.toolKey,
        recommendedToolName: TOOLS[alternative.toolKey].name,
        recommendedMonthlySpend,
        monthlySavings: roundCurrency(currentMonthlySpend - recommendedMonthlySpend),
        reason: alternative.reason,
      }
    })
    .filter(Boolean)
}

function calculatePlanCost(toolKey, plan, seats) {
  const monthlyPrice = getMonthlyPrice(toolKey, plan)
  if (monthlyPrice === null || monthlyPrice === undefined) return null
  return roundCurrency(isPricePerUser(toolKey, plan) ? monthlyPrice * seats : monthlyPrice)
}

function buildAuditSummary(totalMonthlySavings, recommendations) {
  if (recommendations.length === 0) {
    return 'No obvious overspend flags yet. Your current stack looks fairly aligned with your team size and use case.'
  }

  if (totalMonthlySavings < 50) {
    return 'A few small plan adjustments could trim spend without changing your team workflow.'
  }

  if (recommendations.some((item) => item.recommendationType === 'switch')) {
    return 'Most of the upside comes from swapping at least one tool, not only downgrading plans.'
  }

  return 'The clearest savings path is tightening plan selection across the tools you already use.'
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100
}

function generateAuditId() {
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}
