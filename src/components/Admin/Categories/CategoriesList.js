import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { PencilSquare, PlusCircle, Trash } from 'react-bootstrap-icons'
import ConfirmActionModal from '../../Commons/ConfirmActionModal'
import Pagination from '../Layout/Pagination'
import {
  getAllCategories,
  getAllCategoriesPaginated,
  removeCategory,
} from '../../../services/admin/categoriesService'
import { DEFAULT_ITEMS_PER_PAGE, MODAL_HELPER_TEXT } from '../../../utils/constants'
import useFullPageLoader from '../../../hooks/useFullPageLoader'
import UpsertCategoryModal from './UpsertCategoryModal'

function CategoriesList() {
  const [modal, setModal] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [isCategoryUpdated, setCategoryUpdated] = useState(false)
  const [categoriesTotalLength, setCategoriesTotalLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setCategoryUpdated(false)
      await getAllCategoriesPaginated(
        currentPage,
        DEFAULT_ITEMS_PER_PAGE,
        setCategories,
        setCategoriesTotalLength
      )
      await getAllCategories(setAllCategories)

      hideLoader()
    }

    fetchData()
  }, [isCategoryUpdated, currentPage])

  const showUpsertModal = (category) => {
    setModal(
      <UpsertCategoryModal
        showLoader={showLoader}
        hideLoader={hideLoader}
        setModal={setModal}
        setCategoryUpdated={setCategoryUpdated}
        categories={allCategories}
        categoryToUpdate={category}
      />
    )
  }

  const showDeleteModal = (categoryId) => {
    const action = async () => {
      showLoader()
      await removeCategory(categoryId)
      setCategoryUpdated(true)
      setModal(false)
    }

    const RemoveButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <Trash className="button-icon" /> Delete
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={RemoveButton}
        helperText={MODAL_HELPER_TEXT.REMOVE_SCRIPT_CATEGORY}
      />
    )
  }

  const handlePaginationClick = (page) => setCurrentPage(page)

  return (
    <>
      {loader}
      {modal}
      <Container fluid="xxl" className={`mt-5 ${loader ? 'blur' : ''}`}>
        <Row>
          <h1>Scripts Categories</h1>
        </Row>
        <Row>
          <Col>
            <Button
              className="float-end"
              style={{ marginBottom: '10px' }}
              variant="success"
              onClick={() => showUpsertModal(null)}
            >
              <PlusCircle className="button-icon" /> Create
            </Button>
          </Col>
        </Row>
        <Table bordered responsive="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>{category.parentId ? category.parentId.name : 'Root category'}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mx-2"
                    onClick={() => showUpsertModal(category)}
                  >
                    <PencilSquare className="button-icon" /> Edit
                  </Button>
                  <Button variant="danger" disabled onClick={() => showDeleteModal(category._id)}>
                    <Trash className="button-icon" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
          totalItems={categoriesTotalLength}
          onPageChange={handlePaginationClick}
        />
      </Container>
    </>
  )
}

export default CategoriesList
