import { calculateAudit } from './auditService'
import { clonePricingCatalog, getPricingCatalog } from './pricingService'

export const buildPricingSnapshot = (pricingCatalog = getPricingCatalog()) => {
  return clonePricingCatalog(pricingCatalog)
}

export const buildPricingVersion = (pricingCatalog = getPricingCatalog()) => {
  return JSON.stringify(pricingCatalog)
}

export const rerunStoredAudit = (storedAudit, pricingCatalog = getPricingCatalog()) => {
  return calculateAudit(storedAudit.inputStack, pricingCatalog, {
    auditId: storedAudit.id,
    timestamp: new Date().toISOString(),
  })
}

export const compareAuditResults = (previousResult, nextResult) => {
  const previousTools = Object.fromEntries((previousResult.tools ?? []).map((tool) => [tool.toolKey, tool]))
  const nextTools = Object.fromEntries((nextResult.tools ?? []).map((tool) => [tool.toolKey, tool]))

  const changedTools = Object.keys({ ...previousTools, ...nextTools }).reduce((changes, toolKey) => {
    const previousTool = previousTools[toolKey]
    const nextTool = nextTools[toolKey]

    if (!previousTool || !nextTool) {
      changes.push({
        toolKey,
        previousTool,
        nextTool,
        changed: true,
      })
      return changes
    }

    const changed =
      previousTool.recommendedToolKey !== nextTool.recommendedToolKey ||
      previousTool.recommendedPlan !== nextTool.recommendedPlan ||
      previousTool.recommendedMonthlySpend !== nextTool.recommendedMonthlySpend ||
      previousTool.monthlySavings !== nextTool.monthlySavings ||
      previousTool.reason !== nextTool.reason

    changes.push({
      toolKey,
      previousTool,
      nextTool,
      changed,
    })
    return changes
  }, [])

  const changed = changedTools.some((tool) => tool.changed)

  return {
    changed:
      changed ||
      previousResult.totalMonthlySavings !== nextResult.totalMonthlySavings ||
      previousResult.totalAnnualSavings !== nextResult.totalAnnualSavings ||
      previousResult.summary !== nextResult.summary,
    totalMonthlySavingsDelta: roundCurrency(nextResult.totalMonthlySavings - previousResult.totalMonthlySavings),
    totalAnnualSavingsDelta: roundCurrency(nextResult.totalAnnualSavings - previousResult.totalAnnualSavings),
    changedTools,
  }
}

export const comparePricingSnapshots = (previousSnapshot, nextSnapshot) => {
  const toolKeys = Object.keys({ ...(previousSnapshot ?? {}), ...(nextSnapshot ?? {}) })

  return toolKeys.reduce((changes, toolKey) => {
    const previousPlans = previousSnapshot?.[toolKey] ?? {}
    const nextPlans = nextSnapshot?.[toolKey] ?? {}
    const planKeys = Object.keys({ ...previousPlans, ...nextPlans })

    planKeys.forEach((planKey) => {
      const previousPlan = previousPlans[planKey] ?? null
      const nextPlan = nextPlans[planKey] ?? null

      if (!previousPlan && nextPlan) {
        changes.push({
          toolKey,
          plan: planKey,
          type: 'added',
          previousMonthly: null,
          nextMonthly: nextPlan.monthly ?? null,
        })
        return
      }

      if (previousPlan && !nextPlan) {
        changes.push({
          toolKey,
          plan: planKey,
          type: 'removed',
          previousMonthly: previousPlan.monthly ?? null,
          nextMonthly: null,
        })
        return
      }

      if (previousPlan?.monthly !== nextPlan?.monthly) {
        changes.push({
          toolKey,
          plan: planKey,
          type: 'price_changed',
          previousMonthly: previousPlan?.monthly ?? null,
          nextMonthly: nextPlan?.monthly ?? null,
        })
      }
    })

    return changes
  }, [])
}

export const buildStoredAuditRecord = ({
  auditId,
  email,
  auditInput,
  auditResult,
  pricingSnapshot,
  sharedAudit,
  createdAt,
}) => {
  return {
    id: auditId,
    email,
    payload: auditResult,
    input_stack: auditInput,
    output_result: auditResult,
    pricing_snapshot: pricingSnapshot,
    shared_payload: sharedAudit,
    created_at: createdAt ?? auditResult.timestamp,
  }
}

export const normalizeStoredAudit = (row) => {
  return {
    id: row.id,
    email: row.email,
    inputStack: row.input_stack ?? row.payload?.inputStack ?? null,
    outputResult: row.output_result ?? row.payload ?? null,
    pricingSnapshot: row.pricing_snapshot ?? null,
    sharedPayload: row.shared_payload ?? null,
    createdAt: row.created_at,
  }
}

export const buildEmailAuditSummary = ({ previousResult, nextResult, diff }) => {
  const previousTopRecommendation = describeTopRecommendation(previousResult)
  const nextTopRecommendation = describeTopRecommendation(nextResult)

  return {
    previousTopRecommendation,
    nextTopRecommendation,
    totalMonthlySavingsDelta: diff.totalMonthlySavingsDelta,
  }
}

function describeTopRecommendation(result) {
  const primary = result.recommendations?.[0] ?? result.tools?.[0]
  if (!primary) {
    return 'No recommendation'
  }

  if (primary.recommendationType === 'keep') {
    return `Keep ${primary.toolName} ${primary.currentPlan}`
  }

  const targetTool = primary.recommendedToolName ?? primary.toolName
  const targetPlan = primary.recommendedPlan ?? primary.currentPlan
  return `${targetTool} ${targetPlan}`
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100
}
