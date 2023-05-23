import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, CloseButton, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FiCheckCircle, FiPlusCircle } from 'react-icons/fi'

import { INFO_FIELDS_VARIANTS } from '../../utils/constants'
import UpsertMyInfoFieldModal from './UpsertInfoFieldModal'
import style from './index.module.css'

function AddInfoFieldModal({ setModal, setInfoFields, infoFields, toast, fields, userInfoFields }) {
  const [infoFieldVariant, setInfoFieldVariant] = useState(INFO_FIELDS_VARIANTS.NONE)

  const hideModal = () => setModal(false)

  const selectInfoField = (infoField) => {
    const fieldFound = [...fields, ...infoFields].find(
      (field) => field.shortcode === infoField.shortcode
    )

    if (fieldFound) {
      return toast.error('Field with this shortcode already exists')
    }

    setInfoFields([...infoFields, infoField])
    hideModal()
  }

  if (infoFieldVariant === INFO_FIELDS_VARIANTS.CREATE || userInfoFields.length < 1) {
    return (
      <UpsertMyInfoFieldModal
        setModal={setModal}
        setInfoFields={setInfoFields}
        infoFields={infoFields}
        fields={fields}
        toast={toast}
      />
    )
  }

  if (infoFieldVariant === INFO_FIELDS_VARIANTS.SELECT) {
    return (
      <Modal show onHide={hideModal} centered>
        <Modal.Header>
          <h5>Select field</h5>
          <CloseButton onClick={hideModal} />
        </Modal.Header>
        <Modal.Body className={style.infoFieldsGroup}>
          {userInfoFields.map((field) => (
            <OverlayTrigger
              key={field.field}
              placement="bottom"
              trigger={['hover', 'focus']}
              overlay={
                field.value ? <Tooltip className="overlay-tooltip">{field.value}</Tooltip> : <></>
              }
            >
              <Badge
                variant="primary"
                className={style.infoFieldBadge}
                onClick={() => selectInfoField(field)}
              >
                {field.shortcode}
              </Badge>
            </OverlayTrigger>
          ))}
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal show onHide={hideModal} centered>
      <Modal.Header>
        <h5>Choose variant</h5>
        <CloseButton onClick={hideModal} />
      </Modal.Header>
      <Modal.Body className={style.addInfoBody}>
        <Button
          variant="outline-success"
          onClick={() => setInfoFieldVariant(INFO_FIELDS_VARIANTS.CREATE)}
        >
          <FiPlusCircle /> Create New
        </Button>
      </Modal.Body>
      <Modal.Body>
        <Button
          variant="outline-warning"
          style={{ width: '100%' }}
          onClick={() => setInfoFieldVariant(INFO_FIELDS_VARIANTS.SELECT)}
        >
          <FiCheckCircle /> Add Existing
        </Button>
      </Modal.Body>
    </Modal>
  )
}

AddInfoFieldModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  setInfoFields: PropTypes.func.isRequired,
  infoFields: PropTypes.array,
  fields: PropTypes.array,
  toast: PropTypes.func.isRequired,
}

export default AddInfoFieldModal
