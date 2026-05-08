// Form validation logic

export const validateAuditForm = (formData) => {
  const errors = {}

  const selectedTools = Object.entries(formData.tools || {}).filter(
    ([, tool]) => tool && tool.plan,
  )

  if (selectedTools.length === 0) {
    errors.tools = 'Select at least one AI tool'
  }

  selectedTools.forEach(([toolKey, tool]) => {
    const spend = Number(tool.spend)
    const seats = Number(tool.seats)

    if (tool.spend === '' || tool.spend === null || Number.isNaN(spend)) {
      errors[`spend_${toolKey}`] = 'Enter a valid number'
      return
    }

    if (spend < 0) {
      errors[`spend_${toolKey}`] = 'Monthly spend cannot be negative'
    }

    if (!Number.isInteger(seats) || seats < 1) {
      errors[`seats_${toolKey}`] = 'Seats must be at least 1'
    }
  })

  if (!formData.teamSize) {
    errors.teamSize = 'Select team size'
  }

  if (!formData.useCase) {
    errors.useCase = 'Select primary use case'
  }

  return errors
}

export const isFormValid = (formData) => {
  return Object.keys(validateAuditForm(formData)).length === 0
}
