import { PRICING } from '../constants/pricing'

export const getMonthlyPrice = (tool, plan) => {
  const pricing = PRICING[tool]?.[plan]
  if (!pricing) return null
  return pricing.monthly
}

export const getAnnualPrice = (tool, plan) => {
  const pricing = PRICING[tool]?.[plan]
  if (!pricing) return null
  return pricing.annual || (pricing.monthly ? pricing.monthly * 12 : null)
}

export const isPricePerUser = (tool, plan) => {
  return PRICING[tool]?.[plan]?.perUser === true
}

export const getPricingMeta = (tool, plan) => {
  return PRICING[tool]?.[plan] ?? null
}
