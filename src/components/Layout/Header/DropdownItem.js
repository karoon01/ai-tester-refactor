import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import style from './index.module.css'

function DropdownItem({ text, onClick }) {
  return (
    <Dropdown.Item as="button" onClick={onClick} className={style.dropdownItem}>
      {text}
    </Dropdown.Item>
  )
}

DropdownItem.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default DropdownItem
