import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

function SearchInput({ onChange, value, setSearchedScripts }) {
  return (
    <Form.Control
      type="search"
      placeholder="Search"
      onChange={(e) => {
        onChange(e)
        setSearchedScripts(e.target.value)
      }}
      value={value}
      aria-label="Search"
    />
  )
}

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  setSearchedScripts: PropTypes.func.isRequired,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  value: PropTypes.any,
}

export default SearchInput
