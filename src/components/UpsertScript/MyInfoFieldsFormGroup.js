import React from 'react'
import { Badge, Button, Card, CloseButton, Form, InputGroup } from 'react-bootstrap'
import { FiEdit, FiPlusCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { insertField, removeField } from '../../utils/utils'
import AddInfoFieldModal from './AddInfoFieldModal'
import style from './index.module.css'
import UpsertMyInfoFieldModal from './UpsertInfoFieldModal'

const MyInfoFieldsFormGroup = ({
  textArea,
  infoFields,
  fields,
  userInfoFields,
  clearErrors,
  trigger,
  setModal,
  setInfoFields,
  setValue,
  setFields,
}) => {
  const showEditInfoFieldModal = (infoField) => {
    setModal(
      <UpsertMyInfoFieldModal
        infoField={infoField}
        toast={toast}
        setModal={setModal}
        setInfoFields={setInfoFields}
        fields={fields}
        infoFields={infoFields}
        scriptValue={textArea}
        setFormValue={setValue}
      />
    )
  }

  const showCreateInfoFieldModal = () => {
    setModal(
      <AddInfoFieldModal
        setModal={setModal}
        setInfoFields={setInfoFields}
        infoFields={infoFields}
        fields={fields}
        toast={toast}
        userInfoFields={userInfoFields}
      />
    )
  }

  const showInfoFields = () => {
    return infoFields.map((field, key) => (
      <Badge key={field.shortcode} bg="primary" text="light">
        <InputGroup>
          <FiEdit
            className={style.infoBadgesEdit}
            size={15}
            onClick={() => showEditInfoFieldModal(field)}
          />
          <div
            className={style.infoBadgesItem}
            onClick={() =>
              insertField(field.shortcode, { textArea, clearErrors, setValue, trigger })
            }
          >
            {`${field.shortcode}`}
          </div>
          <CloseButton
            style={{ marginLeft: 4 }}
            onClick={() =>
              removeField(infoFields, key, 'infoField', {
                textArea,
                setValue,
                setInfoFields,
                setFields,
              })
            }
          />
        </InputGroup>
      </Badge>
    ))
  }

  return (
    <Form.Group className="mt-3">
      <Form.Label>
        <b>My Info Fields</b>
      </Form.Label>
      <Card>
        <Card.Body>
          <Button
            className="float-end"
            variant="outline-success"
            onClick={showCreateInfoFieldModal}
          >
            <FiPlusCircle className="button-icon" /> Add
          </Button>
          <Form.Group>
            <div className={style.infoBadges}>{showInfoFields()}</div>
          </Form.Group>
        </Card.Body>
      </Card>
    </Form.Group>
  )
}

export default MyInfoFieldsFormGroup
