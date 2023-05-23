import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import AutoResizableTextArea from '../../AutoResizableTextArea'

function InfoFieldValue({ value, onChange, error, placeholder, label }) {
  return (
    <Form.Group className="mt-3">
      <Form.Label>{label}</Form.Label>
      <AutoResizableTextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={1}
        required
        isInvalid={error}
      />
      <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
    </Form.Group>
  )
}

InfoFieldValue.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  value: PropTypes.any,
}

export default InfoFieldValue
