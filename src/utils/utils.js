export const getNotFilledFieldsMessage = (fields, isRunning = false) => {
  const notFilledFields = fields.filter((field) => !field.value)

  const fieldNames = []

  if (notFilledFields.length > 0) {
    notFilledFields.forEach((field) => {
      fieldNames.push(`"${field.shortcode}"`)
    })

    return `To ${isRunning ? 'run' : 'save'} the script fill in the ${fieldNames.join(', ')} field${
      fieldNames.length > 1 ? 's' : ''
    }`
  }

  return ''
}

export const debounce = (fn, delay) => {
  let timerId
  return (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => fn(...args), delay)
  }
}
