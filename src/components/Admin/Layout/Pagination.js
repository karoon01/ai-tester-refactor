import React from 'react'
import PropTypes from 'prop-types'
import { Pagination as BootstapPagination } from 'react-bootstrap'

function Pagination({ currentPage, itemsPerPage, totalItems, onPageChange }) {
  const pageAmount = Math.ceil(totalItems / itemsPerPage)
  const pages = Array.from({ length: pageAmount }, (_, i) => i + 1)

  if (pageAmount <= 1) return null

  return (
    <BootstapPagination>
      <BootstapPagination.Prev />
      {pages.map((page) => (
        <BootstapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstapPagination.Item>
      ))}
      <BootstapPagination.Next />
    </BootstapPagination>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
