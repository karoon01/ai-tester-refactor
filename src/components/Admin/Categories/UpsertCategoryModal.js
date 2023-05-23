import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, CloseButton, Col, Form, Modal, Row } from 'react-bootstrap'
import { CheckCircle, XCircle } from 'react-bootstrap-icons'
import { createCategory, updateCategory } from '../../../services/admin/categoriesService'
import { INPUT_TYPES } from '../../../utils/constants'
import UpsertMyInfoFieldModal from '../../UpsertScript/UpsertInfoFieldModal'
import HookFormControllerField from '../../HookForm/ControllerField'

function UpsertCategoryModal({
  setModal,
  setCategoryUpdated,
  showLoader,
  hideLoader,
  categories,
  categoryToUpdate = null,
}) {
  const { control, handleSubmit, setValue, trigger } = useForm({
    defaultValues: {
      name: categoryToUpdate?.name || '',
      parentId: categoryToUpdate?.parentId?._id || null,
      description: categoryToUpdate?.description || '',
      position: categoryToUpdate?.position || 0,
    },
    mode: 'onChange',
  })

  const onSubmit = async (category) => {
    showLoader()

    categoryToUpdate
      ? await updateCategory(categoryToUpdate._id, category)
      : await createCategory(category)

    setCategoryUpdated(true)
    setModal(false)
    hideLoader()
  }

  const closeModal = () => setModal(false)

  return (
    <Modal show onHide={closeModal} size="lg" centered>
      <Modal.Header>
        <h5>{categoryToUpdate ? 'Update' : 'Create'} Category</h5>
        <CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <HookFormControllerField
                inputType={INPUT_TYPES.FORM_CONTROL}
                name="name"
                control={control}
                placeholder="Enter name"
                label="Name"
                rules={{
                  required: {
                    value: true,
                    message: 'Category name is required',
                  },
                }}
              />
            </Col>
            <Col>
              <HookFormControllerField
                inputType={INPUT_TYPES.CATEGORY_SELECT}
                name="parentId"
                control={control}
                label="Parent Category"
                categories={categories}
                setValue={setValue}
                formFieldName="parentId"
                trigger={trigger}
                allCategories={true}
                defaultValue={categoryToUpdate?.parentId?.name || 'Root Category'}
              />
            </Col>
            <Col>
              <HookFormControllerField
                inputType={INPUT_TYPES.FORM_CONTROL}
                control={control}
                name="position"
                label="Position"
                rules={{
                  required: {
                    value: true,
                    message: 'Position is required',
                  },
                  pattern: {
                    value: /\d+/g,
                    message: 'Only digits allowed',
                  },
                }}
                placeholder="Enter position"
                type="number"
                min="0"
              />
            </Col>
          </Row>
          <HookFormControllerField
            inputType={INPUT_TYPES.FORM_CONTROL}
            control={control}
            name="description"
            label="Description"
            rules={{
              required: {
                value: true,
                message: 'Description is required',
              },
            }}
            placeholder="Enter description"
            as="textarea"
            rows={3}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          variant="success"
          className="modal-button"
          onClick={handleSubmit(onSubmit)}
        >
          <CheckCircle className="button-icon" /> {categoryToUpdate ? 'Save' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={closeModal}>
          <XCircle className="button-icon" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

UpsertCategoryModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  showLoader: PropTypes.func.isRequired,
  hideLoader: PropTypes.func.isRequired,
  setCategoryUpdated: PropTypes.func.isRequired,
  categories: PropTypes.array,
  categoryToUpdate: PropTypes.shape({
    name: PropTypes.string,
    parentId: PropTypes.shape({
      name: PropTypes.string,
    }),
    description: PropTypes.string,
    position: PropTypes.number,
    _id: PropTypes.string,
  }),
}

UpsertMyInfoFieldModal.defaultProps = {
  categories: [],
  categoryToUpdate: null,
}

export default UpsertCategoryModal
