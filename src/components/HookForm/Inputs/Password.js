import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function PasswordInput({ value, label, placeholder, error, onChange, inputRef }) {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((current) => !current)

  return (
    <Form.Group className="mt-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          value={value}
          ref={inputRef}
          onChange={onChange}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          isInvalid={error}
        />
        <Button
          className="float-end"
          variant="outline-secondary"
          size="sm"
          onClick={handleClickShowPassword}
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </Button>
        {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
      </InputGroup>
    </Form.Group>
  )
}

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PasswordInput
