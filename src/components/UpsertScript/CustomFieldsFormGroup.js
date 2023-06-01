import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { toast } from 'react-hot-toast'
import { FiCopy, FiEdit, FiPlusCircle, FiXCircle } from 'react-icons/fi'
import { insertField, removeField } from '../../utils/utils'
import AutoResizableTextArea from '../AutoResizableTextArea'
import UpsertFieldModal from './UpsertFieldModal'
import style from './index.module.css'

const CustomFieldsFormGroup = ({
  fields,
  textArea,
  infoFields,
  errors,
  trigger,
  clearErrors,
  setModal,
  setFields,
  setValue,
  setInfoFields,
}) => {
  const setFieldValue = (key, value) => {
    const customFields = [...fields]
    customFields[key]['value'] = value
    setFields(customFields)
  }

  const showCreateFieldModal = () => {
    setModal(
      <UpsertFieldModal
        setModal={setModal}
        setFields={setFields}
        fields={fields}
        toast={toast}
        infoFields={infoFields}
      />
    )
  }

  const showEditFieldModal = (externalField) => {
    setModal(
      <UpsertFieldModal
        setModal={setModal}
        setFields={setFields}
        fields={fields}
        toast={toast}
        infoFields={infoFields}
        externalField={externalField}
        scriptValue={textArea}
        setFormValue={setValue}
      />
    )
  }

  const showCustomFields = () => {
    return fields.map((field, key) => (
      <Form.Group key={field.shortcode} className="mt-3">
        <Form.Label>
          <b>{field.shortcode}</b>
        </Form.Label>

        <Row className="float-end" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <span className={style.editButton} onClick={() => showEditFieldModal(field)}>
              <FiEdit size={25} />
            </span>
          </Col>
          <Col>
            <span
              className={style.addButton}
              onClick={() =>
                insertField(field.shortcode, { textArea, clearErrors, setValue, trigger })
              }
            >
              <FiCopy size={25} />
            </span>
          </Col>
          <Col>
            <span
              className={style.closeButton}
              onClick={() =>
                removeField(fields, key, 'customField', {
                  textArea,
                  setValue,
                  setInfoFields,
                  setFields,
                })
              }
            >
              <FiXCircle size={25} />
            </span>
          </Col>
        </Row>

        <AutoResizableTextArea
          value={field?.value}
          onChange={(e) => setFieldValue(key, e.target.value)}
          placeholder="Enter value"
          required
          isInvalid={errors.value}
        />
        <Form.Control.Feedback type="invalid">
          You should provide value for field
        </Form.Control.Feedback>
      </Form.Group>
    ))
  }

  return (
    <>
      <Form.Group>
        <h5 style={{ textAlign: 'center' }}>Custom Fields</h5>
        <Button
          className="float-end"
          variant="outline-success"
          onClick={() => showCreateFieldModal()}
        >
          <FiPlusCircle className="button-icon" /> Add
        </Button>
      </Form.Group>
      <Form.Group style={{ marginTop: 63 }}>{showCustomFields()}</Form.Group>
    </>
  )
}

export default CustomFieldsFormGroup
