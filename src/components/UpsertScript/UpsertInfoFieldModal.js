import PropTypes from 'prop-types'
import { Button, CloseButton, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import HelpTooltip from '../Commons/HelpTooltip'
import { INPUT_TYPES, TOOLTIP_HELP_TEXT } from '../../utils/constants'
import HookFormControllerField from '../HookForm/ControllerField'

function UpsertMyInfoFieldModal({
  setModal,
  setInfoFields,
  infoFields,
  toast,
  fields,
  infoField = null,
  scriptValue,
  setFormValue,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      shortcode: infoField?.shortcode || '',
      value: infoField?.value || '',
    },
    mode: 'onChange',
  })

  const isFieldAlreadyExists = (values) => {
    const fieldFound = [...fields, ...infoFields].find(
      (field) => field.field !== infoField?.field && field.shortcode === values.shortcode
    )
    if (fieldFound) {
      toast.error('Field with this shortcode already exists')
      return true
    }
    return false
  }

  const onCreateSubmit = (values) => {
    if (isFieldAlreadyExists(values)) return

    setInfoFields([
      ...infoFields,
      {
        shortcode: values.shortcode,
        isUserInfoField: true,
        value: values.value,
      },
    ])

    reset()
    setModal(false)
    toast.success('Info field successfully created!')
  }

  const onEditSubmit = (values) => {
    if (isFieldAlreadyExists(values)) return

    const key = infoFields.indexOf(infoField)

    setInfoFields([
      ...infoFields.map((field) =>
        field['shortcode'] === infoField.shortcode
          ? {
              field: infoField.field,
              shortcode: values.shortcode,
              isUserInfoField: true,
              value: values.value,
            }
          : field
      ),
    ])

    const value = scriptValue.current.value
    setFormValue(
      'value',
      value.replaceAll(`{${infoFields[key]['shortcode']}}`, `{${values.shortcode}}`)
    )

    reset()
    handleCloseModal()
    toast.success('Info field successfully edited!')
  }

  const onSubmit = infoField ? onEditSubmit : onCreateSubmit

  const handleCloseModal = () => setModal(false)

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
  key: PropTypes.string,
  setModal: PropTypes.func.isRequired,
  setInfoFields: PropTypes.func.isRequired,
  infoFields: PropTypes.array,
  fields: PropTypes.array,
  toast: PropTypes.func.isRequired,
  setFormValue: PropTypes.func,
}

UpsertMyInfoFieldModal.defaultProps = {
  infoFields: [],
  fields: [],
}

export default UpsertMyInfoFieldModal
