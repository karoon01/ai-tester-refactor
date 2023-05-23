import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, CloseButton, Form, Modal } from 'react-bootstrap'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import UpsertMyInfoFieldModal from '../UpsertScript/UpsertInfoFieldModal'
import HelpTooltip from '../Commons/HelpTooltip'
import { INPUT_TYPES, TOOLTIP_HELP_TEXT } from '../../utils/constants'
import HookFormControllerField from '../HookForm/ControllerField'

function UpsertInfoFieldModal({
  setModal,
  showLoader,
  hideLoader,
  createFieldMethod,
  editFieldsMethod,
  setInfoFieldUpdated,
  infoFields,
  toast,
  infoField = null,
}) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      shortcode: infoField?.shortcode || '',
      value: infoField?.value || '',
    },
    mode: 'onChange',
  })

  const isFieldAlreadyExists = (values) => {
    const fieldFound = infoFields.find(
      (field) => field.field !== infoField?.field && field.shortcode === values.shortcode
    )
    if (fieldFound) {
      toast.error('Field with this shortcode already exists')
      return true
    }
    return false
  }

  const handleCloseModal = () => setModal(false)

  const onCreateSubmit = async (values) => {
    if (isFieldAlreadyExists(values)) return

    showLoader()
    await createFieldMethod(values)
    setInfoFieldUpdated(true)
    hideLoader()
    handleCloseModal()
    toast.success('Info field successfully created!')
  }

  const onEditSubmit = async (values) => {
    if (isFieldAlreadyExists(values)) return

    showLoader()
    await editFieldsMethod(infoField.field, values)
    setInfoFieldUpdated(true)
    handleCloseModal()
    hideLoader()
    toast.success('Info field successfully updated!')
  }

  const onSubmit = infoField ? onEditSubmit : onCreateSubmit

  return (
    <Modal show onHide={handleCloseModal} centered>
      <Modal.Header>
        <h5>{infoField ? 'Edit My Info Field' : 'Create My Info Field'}</h5>
        <CloseButton onClick={handleCloseModal} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <HookFormControllerField
            inputType={INPUT_TYPES.FORM_CONTROL}
            control={control}
            name="shortcode"
            label={
              <>
                Short Code <HelpTooltip tooltipText={TOOLTIP_HELP_TEXT.SHORTCODE_EXPLANATION} />
              </>
            }
            rules={{
              pattern: {
                value: /^[a-z0-9-]+$/i,
                message: 'Only letters, numbers and hyphen allowed',
              },
              required: {
                value: true,
                message: 'Shortcode is required',
              },
            }}
            placeholder="Enter shortcode"
            disabled={!!infoField}
          />
          <HookFormControllerField
            inputType={INPUT_TYPES.INFO_FIELD_VALUE}
            label="Value"
            control={control}
            name="value"
            rules={{
              required: {
                value: true,
                message: 'Value is required',
              },
            }}
            placeholder="Enter value"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="modal-button"
          variant="success"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          <FiCheckCircle className="button-icon" /> {infoField ? 'Save' : 'Create'}
        </Button>
        <Button variant="secondary" onClick={handleCloseModal}>
          <FiXCircle className="button-icon" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

UpsertMyInfoFieldModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  showLoader: PropTypes.func.isRequired,
  hideLoader: PropTypes.func.isRequired,
  setInfoFieldUpdated: PropTypes.func.isRequired,
  infoFields: PropTypes.array,
  toast: PropTypes.func.isRequired,
  infoField: PropTypes.object,
}

UpsertMyInfoFieldModal.defaultProps = {
  infoFields: [],
}

export default UpsertInfoFieldModal
