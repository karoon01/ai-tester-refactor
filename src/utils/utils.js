import { toast } from 'react-hot-toast'
import { curlyBracesRegex, scriptVariableRegex } from './constants'

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

export const insertField = (shortCode, { textArea, clearErrors, setValue, trigger }) => {
  const currentPosition = textArea.current.selectionStart

  const value = textArea.current.value

  clearErrors('script')
  setValue(
    'value',
    `${value.slice(0, currentPosition)}{${shortCode}}${value.slice(currentPosition)}`
  )
  trigger('value')
}

export const removeField = (
  selectedFields,
  key,
  type,
  { textArea, setValue, setInfoFields, setFields }
) => {
  const value = textArea.current.value
  setValue('value', value.replaceAll(`{${selectedFields[key]['shortcode']}}`, ''))

  const result = selectedFields.filter((field, index) => key !== index)
  type === 'infoField' ? setInfoFields(result) : setFields(result)
}

export const isFormValid = (requiredFields, { fields, infoFields, values }) => {
  if (requiredFields.includes('fields') && [...fields, ...infoFields].length === 0) {
    return false
  }

  return requiredFields.every((field) => !!values[field])
}

export const validateScriptInput = (value) => {
  if (!value.match(curlyBracesRegex)) {
    return 'All curly braces must be closed'
  }

  if (!value.match(scriptVariableRegex)) return 'Script should have at least one variable'
}

export const isFieldsValid = (getValues, fields, infoFields) => {
  const shortcodeRegex = /{([^}]+)}/g

  const scriptValue = getValues('value')
  const allFields = [...fields, ...infoFields]

  const fieldsFromText = scriptValue
    .match(shortcodeRegex)
    .map((shortcode) => shortcode.slice(1, -1))

  const notAddedFields = allFields.filter((field) => {
    if (scriptValue.search(`{${field.shortcode}}`) === -1) {
      return field
    }
  })

  const undefinedFields = fieldsFromText.filter(
    (field) => !allFields.some(({ shortcode }) => field === shortcode)
  )

  if (notAddedFields.length > 0) {
    toast.error(
      `Some fields are not added to text: ${notAddedFields
        .map((field) => `{${field.shortcode}}`)
        .join(', ')}`
    )
    return false
  }
  if (undefinedFields.length > 0) {
    toast.error(`In your script are used fields that doesn't exist: ${undefinedFields.join(', ')}`)
    return false
  }
  return true
}
