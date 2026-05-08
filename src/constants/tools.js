// AI Tools Configuration
export const TOOLS = {
  cursor: {
    name: 'Cursor',
    plans: ['Hobby', 'Pro', 'Business', 'Enterprise'],
    defaultPlan: 'Pro',
    description: 'AI code editor',
    category: 'Coding',
  },
  copilot: {
    name: 'GitHub Copilot',
    plans: ['Individual', 'Business', 'Enterprise'],
    defaultPlan: 'Individual',
    description: 'Code completion in IDE',
    category: 'Coding',
  },
  claude: {
    name: 'Claude',
    plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API Direct'],
    defaultPlan: 'Pro',
    description: 'General-purpose AI assistant',
    category: 'General',
  },
  chatgpt: {
    name: 'ChatGPT',
    plans: ['Plus', 'Team', 'Enterprise', 'API Direct'],
    defaultPlan: 'Plus',
    description: 'Conversational AI',
    category: 'General',
  },
  anthropic_api: {
    name: 'Anthropic API (Direct)',
    plans: ['Pay-as-you-go'],
    defaultPlan: 'Pay-as-you-go',
    description: 'Claude via API',
    category: 'API',
  },
  openai_api: {
    name: 'OpenAI API (Direct)',
    plans: ['Pay-as-you-go'],
    defaultPlan: 'Pay-as-you-go',
    description: 'ChatGPT/GPT-4 via API',
    category: 'API',
  },
  gemini: {
    name: 'Google Gemini',
    plans: ['Free', 'Pro', 'Ultra', 'API'],
    defaultPlan: 'Pro',
    description: "Google's AI assistant",
    category: 'General',
  },
  windsurf: {
    name: 'Windsurf',
    plans: ['Free', 'Pro'],
    defaultPlan: 'Pro',
    description: "Codeium's code editor",
    category: 'Coding',
  },
}

export const USE_CASES = ['Coding', 'Writing', 'Data', 'Research', 'Mixed']

export const TEAM_SIZE_RANGES = [
  { label: '1-5', value: 'small' },
  { label: '6-15', value: 'medium' },
  { label: '16-50', value: 'large' },
  { label: '50+', value: 'enterprise' },
]

export const FORM_STORAGE_KEY = 'credex.auditForm.v1'
