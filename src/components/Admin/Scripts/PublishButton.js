import React from 'react'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from 'react-bootstrap'
import { ToggleOff, ToggleOn, XCircle } from 'react-bootstrap-icons'
import { changeScriptType, getScriptExample } from '../../../services/admin/scriptsService'
import { getNotFilledFieldsMessage } from '../../../utils/utils'
import style from './index.module.css'

function PublishButton({ script, showLoader, setScriptUpdated }) {
  const handleVisibilityChange = async (scriptId, currentVisibility) => {
    const { data } = await getScriptExample(script._id)

    const notFilledFieldsMessage = data && getNotFilledFieldsMessage(data.exampleFields)

    if (data && !notFilledFieldsMessage) {
      showLoader()
      await changeScriptType(scriptId, currentVisibility)
      setScriptUpdated(true)
    } else {
      !data
        ? toast.error('Script example should be present to publish this script!')
        : toast.error(notFilledFieldsMessage)
    }
  }

  if (script.type === 'Draft')
    return (
      <>
        <Button variant="outline-secondary" className={style.publicButton} disabled>
          <XCircle className="button-icon" /> Publish
        </Button>
      </>
    )

  return (
    <>
      <Toaster />
      <Button
        variant="primary"
        className={style.publicButton}
        onClick={() => handleVisibilityChange(script._id, script.type)}
      >
        {script.type === 'Public' ? (
          <>
            <ToggleOff className="button-icon" /> Hide
          </>
        ) : (
          <>
            <ToggleOn className="button-icon" /> Publish
          </>
        )}
      </Button>
    </>
  )
}

PublishButton.propTypes = {
  script: PropTypes.object.isRequired,
  showLoader: PropTypes.func.isRequired,
  setScriptUpdated: PropTypes.func.isRequired,
}

export default PublishButton
