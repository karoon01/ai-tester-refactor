import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { INPUT_TYPES } from '../../utils/constants'
import FormControl from './Inputs/FormControl'
import Password from './Inputs/Password'
import CategorySelector from './Inputs/CategorySelector'
import Search from './Inputs/Search'
import InfoFieldValue from './Inputs/InfoFieldValue'
import ScriptResult from './Inputs/ScriptResult'

const INPUT_COMPONENTS = {
  [INPUT_TYPES.FORM_CONTROL]: FormControl,
  [INPUT_TYPES.PASSWORD]: Password,
  [INPUT_TYPES.CATEGORY_SELECT]: CategorySelector,
  [INPUT_TYPES.SEARCH]: Search,
  [INPUT_TYPES.INFO_FIELD_VALUE]: InfoFieldValue,
  [INPUT_TYPES.SCRIPT_RESULT]: ScriptResult,
}

const HookFormControllerField = ({
  name,
  control,
  rules,
  inputType = INPUT_TYPES.TEXT,
  ...rest
}) => {
  const Component = INPUT_COMPONENTS[inputType]

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <Component
          inputRef={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          error={error}
          {...rest}
        />
      )}
    />
  )
}

HookFormControllerField.propTypes = {
  name: PropTypes.string.isRequired,
  rules: PropTypes.shape({}),
  control: PropTypes.shape({}),
  inputType: PropTypes.string.isRequired,
}

export default HookFormControllerField
