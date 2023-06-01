import React, { useRef, useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ArrowClockwise } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { requiredForTryFields } from '../../utils/constants'
import { getNotFilledFieldsMessage, isFieldsValid, isFormValid } from '../../utils/utils'
import ApiKeyModal from '../ApiKeyModal'

const TryScriptButton = ({
  errors,
  fields,
  infoFields,
  values,
  tryScriptMethod,
  showLoader,
  hideLoader,
  setModal,
  getValues,
  setValue,
  setToastId,
}) => {
  const [isScriptRunning, setScriptRunning] = useState(false)
  const tryRef = useRef(null)

  const handleTryScript = async () => {
    const scriptValue = getValues('value')

    const allFields = [...fields, ...infoFields]

    const notFilledFieldsMessage = getNotFilledFieldsMessage(allFields, true)

    if (notFilledFieldsMessage) {
      return toast.error(notFilledFieldsMessage)
    }

    setValue('fields', allFields)

    if (!isFieldsValid(getValues, fields, infoFields)) return

    const executeScript = async () => {
      setScriptRunning(true)

      const setResult = (result) => {
        setValue('result', result)
      }

      await tryScriptMethod(scriptValue, allFields, setResult, showApiKeyModal)
    }

    const loadingToastId = toast.loading('Script is running...')
    setToastId(loadingToastId)
    await executeScript()
      .then(() => toast.success('Script executed successfully!'))
      .catch((err) => toast.error(`Something went wrong!\n${err}`))
      .finally(() => {
        setScriptRunning(false)
        toast.remove(loadingToastId)
        setToastId()
      })
  }

  const showApiKeyModal = () => {
    setModal(
      <ApiKeyModal
        setModal={setModal}
        showLoader={showLoader}
        hideLoader={hideLoader}
        afterSubmit={() => {
          tryRef.current.click()
        }}
      />
    )
  }

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="right"
      overlay={
        !errors.value && isFormValid(requiredForTryFields, { fields, infoFields, values }) ? (
          <></>
        ) : (
          <Tooltip className="overlay-tooltip">
            You should fill script text and fields in to try script
          </Tooltip>
        )
      }
    >
      <Button
        variant="primary"
        className="mt-5 mb-3"
        onClick={() =>
          !errors.value &&
          isFormValid(requiredForTryFields, { fields, infoFields, values }) &&
          handleTryScript()
        }
        ref={tryRef}
        disabled={isScriptRunning}
      >
        <ArrowClockwise /> Try Script
      </Button>
    </OverlayTrigger>
  )
}

export default TryScriptButton
