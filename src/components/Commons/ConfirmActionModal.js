import { Button, Modal } from 'react-bootstrap'
import { XCircle } from 'react-bootstrap-icons'
import React from 'react'
import PropTypes from 'prop-types'

function ConfirmActionModal({ setModal, ActionButton, helperText }) {
  const closeModal = () => setModal(false)

  return (
    <Modal show onHide={closeModal}>
      <Modal.Header>{helperText}</Modal.Header>
      <Modal.Footer>
        <ActionButton />
        <Button variant="secondary" onClick={closeModal}>
          <XCircle className="button-icon" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ConfirmActionModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  ActionButton: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
}

export default ConfirmActionModal
