// Centralized pricing data used by the form and audit services.
// Updated: 2026-05-08

export const PRICING = {
  cursor: {
    Hobby: { monthly: 0, annual: 0 },
    Pro: { monthly: 20, annual: 200 },
    Business: { monthly: 40, annual: 400 },
    Enterprise: { monthly: null, annual: null, note: 'Custom pricing' },
  },
  copilot: {
    Individual: { monthly: 10, annual: 100 },
    Business: { monthly: 19, annual: 190 },
    Enterprise: { monthly: null, annual: null, note: 'Custom pricing' },
  },
  claude: {
    Free: { monthly: 0, annual: 0 },
    Pro: { monthly: 20, annual: 200 },
    Max: { monthly: 30, annual: 300 },
    Team: { monthly: 30, annual: 300, perUser: true },
    Enterprise: { monthly: null, annual: null, note: 'Custom pricing' },
    'API Direct': { monthly: 0, annual: 0, note: 'Pay-as-you-go pricing' },
  },
  chatgpt: {
    Plus: { monthly: 20, annual: 200 },
    Team: { monthly: 30, annual: 300, perUser: true },
    Enterprise: { monthly: null, annual: null, note: 'Custom pricing' },
    'API Direct': { monthly: 0, annual: 0, note: 'Pay-as-you-go pricing' },
  },
  anthropic_api: {
    'Pay-as-you-go': {
      monthly: 0,
      annual: 0,
      note: '$0.003 per 1K input tokens, $0.015 per 1K output tokens',
    },
  },
  openai_api: {
    'Pay-as-you-go': {
      monthly: 0,
      annual: 0,
      note: '$0.50 per 1M input tokens, $1.50 per 1M output tokens (GPT-4 tier placeholder)',
    },
  },
  gemini: {
    Free: { monthly: 0, annual: 0 },
    Pro: { monthly: 19.99, annual: 199.9 },
    Ultra: { monthly: 30, annual: 300, note: 'Limited availability' },
    API: { monthly: 0, annual: 0, note: 'Pay-as-you-go pricing' },
  },
  windsurf: {
    Free: { monthly: 0, annual: 0 },
    Pro: { monthly: 20, annual: 200 },
  },
}
