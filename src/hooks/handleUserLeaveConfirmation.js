import Router from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { BoxArrowLeft } from 'react-bootstrap-icons'
import ConfirmActionModal from '../components/Commons/ConfirmActionModal'
import { MODAL_HELPER_TEXT } from '../utils/constants'

export const useOnLeavePageConfirmation = (setModal, unsavedChanges, router) => {
  const showLeaveConfirmationModal = useCallback(() => {
    const action = () => {
      setModal(false)
      unsavedChanges.current = false
      router.back()
    }

    const LeaveButton = () => {
      return (
        <Button className="modal-button" variant="outline-primary" onClick={action}>
          <BoxArrowLeft className="button-icon" /> Leave
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={LeaveButton}
        helperText={MODAL_HELPER_TEXT.CONFIRM_LEAVE}
      />
    )
  }, [setModal, router])

  useEffect(() => {
    if (unsavedChanges.current) {
      const routeChangeStart = () => {
        const ok = showLeaveConfirmationModal()
        if (!ok) {
          Router.events.emit('routeChangeError')
          throw 'Abort route change. Please ignore this error.'
        }
      }

      Router.events.on('routeChangeStart', routeChangeStart)
      return () => {
        Router.events.off('routeChangeStart', routeChangeStart)
      }
    }
  }, [unsavedChanges.current])
}
