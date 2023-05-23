import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap'

function CategorySelector({
  categories,
  setValue,
  formFieldName,
  defaultValue,
  trigger,
  allCategories,
  error,
  label,
  inputRef,
  className,
}) {
  const [categoryName, setCategoryName] = useState('')

  const handleCategoryChoose = (category) => {
    setCategoryName(category.name)
    setValue(formFieldName, category._id)
    trigger(formFieldName)
  }

  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <DropdownButton
          title=""
          variant="outline-secondary"
          id="input-group-dropdown-2"
          drop="down"
        >
          {allCategories && (
            <Dropdown.Item
              onClick={() => handleCategoryChoose({ _id: null, name: 'Root Category' })}
            >
              Root Category
            </Dropdown.Item>
          )}
          {categories.map((category) => (
            <Dropdown.Item
              key={category._id}
              eventKey={category._id}
              onClick={() => handleCategoryChoose(category)}
            >
              {category.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          ref={inputRef}
          isInvalid={error}
          readOnly
          value={defaultValue && categoryName === '' ? defaultValue : categoryName}
        />
      </InputGroup>
      {error && (
        <div className="text-danger">
          <small>{error.message}</small>
        </div>
      )}
    </Form.Group>
  )
}

CategorySelector.propTypes = {
  categories: PropTypes.array,
  setValue: PropTypes.func.isRequired,
  formFieldName: PropTypes.string,
  defaultValue: PropTypes.string,
  trigger: PropTypes.func.isRequired,
  allCategories: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  className: PropTypes.string,
}

export default CategorySelector
