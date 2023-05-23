import React from 'react'
import PropTypes from 'prop-types'
import { CloseButton, Modal } from 'react-bootstrap'
import ApiKeyForm from '../ApiKeyForm'
import HelpTooltip from '../Commons/HelpTooltip'

function ApiKeyModal({ setModal, showLoader, hideLoader, afterSubmit }) {
  const handleCloseModal = () => setModal(false)

  return (
    <Modal show onHide={handleCloseModal} centered>
      <Modal.Header>
        <h5>
          Enter API Key{' '}
          <HelpTooltip tooltipText="You can find your API key at https://platform.openai.com/account/api-keys." />
        </h5>
        <CloseButton onClick={handleCloseModal} />
      </Modal.Header>
      <Modal.Body>
        <ApiKeyForm
          showLoader={showLoader}
          hideLoader={hideLoader}
          isFullSizeForm={true}
          afterSubmit={() => {
            handleCloseModal()
            afterSubmit()
          }}
        />
      </Modal.Body>
    </Modal>
  )
}

ApiKeyModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  showLoader: PropTypes.func.isRequired,
  hideLoader: PropTypes.func.isRequired,
  afterSubmit: PropTypes.func.isRequired,
}

export default ApiKeyModal
