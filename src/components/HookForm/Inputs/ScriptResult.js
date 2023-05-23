import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

function ScriptResult({ onChange, value, ref, placeholder }) {
  return (
    <Form.Group>
      <Form.Control
        disabled
        as="textarea"
        rows={10}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        ref={ref}
      />
    </Form.Group>
  )
}

ScriptResult.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.any,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
}

export default ScriptResult
