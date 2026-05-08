// Audit Engine Service
// Core logic for calculating AI spending audits

import { getMonthlyPrice } from './pricingService'
import { TOOLS } from '../constants/tools'

/**
 * Calculate audit results for user's AI tool spending
 * @param {Object} formData - User form submission { tools, teamSize, useCase }
 * @returns {Object} Audit results with recommendations and savings
 */
export const calculateAudit = (formData) => {
  const { tools: userTools, teamSize, useCase } = formData

  // Convert team size range to numeric estimate
  const teamSizeEstimate = getTeamSizeEstimate(teamSize)

  const auditResults = {
    auditId: generateAuditId(),
    timestamp: new Date().toISOString(),
    teamSize: { range: teamSize, estimate: teamSizeEstimate },
    useCase,
    tools: [],
    totalMonthlySpend: 0,
    totalAnnualSpend: 0,
    totalMonthlySavings: 0,
    totalAnnualSavings: 0,
    recommendations: []
  }

  // Analyze each selected tool
  Object.entries(userTools).forEach(([toolKey, toolData]) => {
    const toolAnalysis = analyzeToolSpend(
      toolKey,
      toolData,
      teamSize,
      teamSizeEstimate,
      useCase
    )
    auditResults.tools.push(toolAnalysis)
    auditResults.totalMonthlySpend += toolAnalysis.currentMonthlySpend
    auditResults.totalAnnualSpend += toolAnalysis.currentAnnualSpend
    auditResults.totalMonthlySavings += toolAnalysis.monthlySavings
    auditResults.totalAnnualSavings += toolAnalysis.annualSavings
  })

  // Sort tools by savings (highest first)
  auditResults.tools.sort((a, b) => b.monthlySavings - a.monthlySavings)

  return auditResults
}

/**
 * Analyze spending on a single tool
 */
function analyzeToolSpend(toolKey, toolData, teamSizeRange, teamSizeEstimate, useCase) {
  const tool = TOOLS[toolKey]
  const currentPlan = toolData.plan
  const currentMonthlySpend = parseFloat(toolData.spend) || 0
  const seats = parseInt(toolData.seats) || 1

  const analysis = {
    toolKey,
    toolName: tool.name,
    currentPlan,
    currentMonthlySpend,
    currentAnnualSpend: currentMonthlySpend * 12,
    recommendations: [],
    monthlySavings: 0,
    annualSavings: 0,
    reason: ''
  }

  // 1. Check if current plan is right for team size
  const planRecommendation = recommendPlan(toolKey, currentPlan, teamSizeRange)
  if (planRecommendation.newPlan !== currentPlan) {
    const newPrice = getMonthlyPrice(toolKey, planRecommendation.newPlan) || 0
    const savings = currentMonthlySpend - (newPrice * seats)
    if (savings > 0) {
      analysis.recommendations.push({
        type: 'plan-downgrade',
        fromPlan: currentPlan,
        toPlan: planRecommendation.newPlan,
        reason: `Downgrade from ${currentPlan} to ${planRecommendation.newPlan} (better fit for a ${teamSizeEstimate}-person team)`,
        estimatedMonthlySavings: savings
      })
      analysis.monthlySavings += savings
    }
  }

  // 2. Check for cheaper alternatives
  const alternatives = findAlternativeTools(toolKey, useCase, currentMonthlySpend)
  alternatives.forEach(alt => {
    const savings = currentMonthlySpend - alt.estimatedCost
    if (savings > 100) { // Only recommend if >$100/month savings
      analysis.recommendations.push({
        type: 'tool-switch',
        currentTool: tool.name,
        suggestedTool: alt.name,
        reason: alt.reason,
        estimatedMonthlySavings: savings
      })
      analysis.monthlySavings += savings / 4 // Don't double-count, divide by number of alts
    }
  })

  if (analysis.recommendations.length > 0) {
    analysis.monthlySavings = Math.max(...analysis.recommendations.map(r => r.estimatedMonthlySavings || 0))
    analysis.reason = analysis.recommendations[0].reason
  }
  analysis.annualSavings = analysis.monthlySavings * 12

  return analysis
}

/**
 * Recommend the best plan for a tool based on team size
 */
function recommendPlan(toolKey, currentPlan, teamSize) {
  // Simple heuristic: smaller teams don't need enterprise/team plans
  if (teamSize === 'small') {
    if (toolKey === 'claude' && currentPlan === 'Team') return { newPlan: 'Pro' }
    if (toolKey === 'chatgpt' && currentPlan === 'Team') return { newPlan: 'Plus' }
    if (toolKey === 'cursor' && currentPlan === 'Business') return { newPlan: 'Pro' }
  }

  return { newPlan: currentPlan }
}

/**
 * Find cheaper alternative tools for a given use case
 */
function findAlternativeTools(toolKey, useCase, currentSpend) {
  const alternatives = []

  // Example: Claude is cheaper than ChatGPT for coding use case
  if (toolKey === 'chatgpt' && useCase === 'Coding') {
    alternatives.push({
      name: 'Claude',
      estimatedCost: currentSpend * 0.8, // 20% cheaper
      reason: 'Claude Pro is often better for coding and $10 cheaper'
    })
  }

  // Example: Cursor can replace GitHub Copilot
  if (toolKey === 'copilot' && useCase === 'Coding') {
    alternatives.push({
      name: 'Cursor',
      estimatedCost: currentSpend * 0.9,
      reason: 'Cursor provides similar functionality at similar price with better UX'
    })
  }

  return alternatives
}

/**
 * Convert team size range to numeric estimate
 */
function getTeamSizeEstimate(teamSizeRange) {
  const estimates = {
    small: 3,
    medium: 10,
    large: 30,
    enterprise: 100
  }
  return estimates[teamSizeRange] || 10
}

/**
 * Generate unique audit ID
 */
function generateAuditId() {
  return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}
