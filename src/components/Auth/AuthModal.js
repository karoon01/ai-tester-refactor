import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CloseButton, Modal } from 'react-bootstrap'
import AuthForm from './AuthForm'

function AuthModal({ toast, setToken, setModal, onLoginPageAction = null }) {
  const [isLoginForm, setIsLoginForm] = useState(true)

  const onLogin = () => {
    setModal(false)
    if (onLoginPageAction) {
      onLoginPageAction()
    }
  }

  const handleCloseModal = () => setModal(false)

  return (
    <Modal show onHide={handleCloseModal}>
      <Modal.Header>
        <h1>{isLoginForm ? 'Login' : 'Registration'}</h1>
        <CloseButton onClick={handleCloseModal} />
      </Modal.Header>
      <Modal.Body>
        <AuthForm
          toast={toast}
          setToken={setToken}
          onLogin={onLogin}
          isLoginForm={isLoginForm}
          setIsLoginForm={setIsLoginForm}
        />
      </Modal.Body>
    </Modal>
  )
}

AuthModal.propTypes = {
  toast: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired,
  onLoginPageAction: PropTypes.func,
}

export default AuthModal
