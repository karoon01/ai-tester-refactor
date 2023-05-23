import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

function FormControlInput({
  label,
  className,
  placeholder,
  onChange,
  value,
  inputRef,
  error,
  onInputChange,
  controlRef,
  ...rest
}) {
  return (
    <Form.Group className={className}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e)
          if (onInputChange) onInputChange()
        }}
        value={value}
        isInvalid={error}
        ref={(e) => {
          inputRef(e)
          if (controlRef) controlRef.current = e
        }}
        {...rest}
      />
      {error != null && (
        <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>
      )}
    </Form.Group>
  )
}

FormControlInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  value: PropTypes.any,
}

export default FormControlInput
