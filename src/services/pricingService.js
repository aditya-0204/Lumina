import { PRICING } from '../constants/pricing'

export const getPricingCatalog = () => {
  return PRICING
}

export const clonePricingCatalog = (pricingCatalog = PRICING) => {
  return JSON.parse(JSON.stringify(pricingCatalog))
}

const getPlanPricing = (tool, plan, pricingCatalog = PRICING) => {
  const pricing = pricingCatalog[tool]?.[plan]
  if (!pricing) return null
  return pricing
}

export const getMonthlyPrice = (tool, plan, pricingCatalog = PRICING) => {
  return getPlanPricing(tool, plan, pricingCatalog)?.monthly ?? null
}

export const getAnnualPrice = (tool, plan, pricingCatalog = PRICING) => {
  const pricing = getPlanPricing(tool, plan, pricingCatalog)
  if (!pricing) return null
  return pricing.annual || (pricing.monthly ? pricing.monthly * 12 : null)
}

export const isPricePerUser = (tool, plan, pricingCatalog = PRICING) => {
  return getPlanPricing(tool, plan, pricingCatalog)?.perUser === true
}

export const getPricingMeta = (tool, plan, pricingCatalog = PRICING) => {
  return getPlanPricing(tool, plan, pricingCatalog)
}
