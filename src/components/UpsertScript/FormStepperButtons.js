import React from 'react'
import { Button, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ChevronDoubleLeft, ChevronDoubleRight, JournalText, Save } from 'react-bootstrap-icons'
import { requiredForSaveFields, requiredForTryFields } from '../../utils/constants'
import { isFormValid } from '../../utils/utils'

const FormStepperButtons = ({
  isEditing,
  isNext,
  isScriptSaving,
  errors,
  fields,
  infoFields,
  values,
  onMoveBetweenSteps,
}) => {
  const renderMoveButton = () => {
    let textComponent = (
      <>
        <ChevronDoubleLeft /> Previous Step
      </>
    )
    if (isNext) {
      textComponent = (
        <>
          <ChevronDoubleRight /> Next Step
        </>
      )
    }
    return (
      <Button variant="primary" className="mt-3" onClick={onMoveBetweenSteps}>
        {textComponent}
      </Button>
    )
  }

  const renderSaveButton = () => {
    let textComponent = (
      <>
        <Save /> Save
      </>
    )
    if (isNext) {
      textComponent = (
        <>
          <JournalText /> {isEditing ? 'Save' : 'Save as Draft'}
        </>
      )
    }
    return (
      <Button type="submit" variant="outline-success" className="mt-3" disabled={isScriptSaving}>
        {textComponent}
      </Button>
    )
  }

  return (
    <FormGroup className="float-end" style={{ display: 'flex', gap: '10px' }}>
      {isNext ? renderSaveButton() : renderMoveButton()}
      <OverlayTrigger
        placement="right"
        overlay={
          !errors.value &&
          isFormValid(isNext ? requiredForTryFields : requiredForSaveFields, {
            fields,
            infoFields,
            values,
          }) ? (
            <></>
          ) : (
            <Tooltip className="overlay-tooltip">
              You should provide script and valid fields to move to the next step
            </Tooltip>
          )
        }
      >
        {isNext ? renderMoveButton() : renderSaveButton()}
      </OverlayTrigger>
    </FormGroup>
  )
}

export default FormStepperButtons
