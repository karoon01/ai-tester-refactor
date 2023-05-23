import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import { PaginationArrowLeft, PaginationArrowRight, PaginationEllipsis } from '../../../utils/icons'
import style from './index.module.css'

function Pagination({ setCurrentPage, totalItems, itemsPerPage }) {
  const pageAmount = Math.ceil(totalItems / itemsPerPage)

  if (pageAmount <= 1) return null

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage + 1)
  }

  const pageLabelBuilder = (page) => <div>{page}</div>

  return (
    <div className={style.container}>
      <ReactPaginate
        previousLabel={<PaginationArrowLeft />}
        nextLabel={<PaginationArrowRight />}
        pageCount={pageAmount}
        onPageChange={handlePageClick}
        breakLabel={<PaginationEllipsis />}
        pageLinkClassName={style.page}
        containerClassName={style.pagination}
        previousLinkClassName={style.link}
        nextLinkClassName={style.link}
        disabledClassName={style.linkDisabled}
        activeClassName={style.linkActive}
        pageLabelBuilder={pageLabelBuilder}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
      />
    </div>
  )
}
Pagination.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number.isRequired,
}

Pagination.defaultProps = {
  totalItems: 0,
}

export default Pagination
