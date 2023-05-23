import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, CloseButton, Form, Modal } from 'react-bootstrap'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import HelpTooltip from '../Commons/HelpTooltip'
import { INPUT_TYPES, TOOLTIP_HELP_TEXT } from '../../utils/constants'
import HookFormControllerField from '../HookForm/ControllerField'

function UpsertFieldModal({
  setModal,
  setFields,
  fields,
  toast,
  infoFields,
  externalField = null,
  scriptValue,
  setFormValue,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      shortcode: externalField?.shortcode || '',
    },
    mode: 'onChange',
  })

  const isFieldAlreadyExists = (values) => {
    const fieldFound = [...fields, ...infoFields].find(
      (field) => field.shortcode === values.shortcode
    )
    if (fieldFound) {
      toast.error('Field with this shortcode already exists')
      return true
    }
    return false
  }

  const handleCloseModal = () => setModal(false)

  const onCreateSubmit = (values) => {
    if (isFieldAlreadyExists(values)) return

    setFields([
      ...fields,
      {
        shortcode: values.shortcode,
        isUserInfoField: false,
        value: values.value,
      },
    ])

    reset()
    handleCloseModal()
    toast.success('Custom field successfully created')
  }

  const onEditSubmit = (values) => {
    if (isFieldAlreadyExists(values)) return

    const key = fields.indexOf(externalField)

    setFields([
      ...fields.map((field) =>
        field['shortcode'] === externalField.shortcode
          ? {
              name: values.name,
              shortcode: values.shortcode,
              isUserInfoField: false,
              value: values.value,
            }
          : field
      ),
    ])

    const value = scriptValue.current.value
    setFormValue(
      'value',
      value.replaceAll(`{${fields[key]['shortcode']}}`, `{${values.shortcode}}`)
    )

    handleCloseModal()
    toast.success('Field successfully edited!')
  }

  const onSubmit = externalField ? onEditSubmit : onCreateSubmit

  return (
    <Modal show onHide={handleCloseModal} centered>
      <Modal.Header>
        <h5>{externalField ? 'Edit' : 'Create'} Custom Field</h5>
        <CloseButton onClick={handleCloseModal} />
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="modal-button"
            variant="success"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            <FiCheckCircle className="button-icon" /> {externalField ? 'Save' : 'Create'}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            <FiXCircle className="button-icon" /> Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

UpsertFieldModal.propTypes = {
  setModal: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  fields: PropTypes.array,
  infoFields: PropTypes.array,
  toast: PropTypes.func.isRequired,
  setFormValue: PropTypes.func,
}

UpsertFieldModal.defaultProps = {
  fields: [],
  infoFields: [],
}

export default UpsertFieldModal
