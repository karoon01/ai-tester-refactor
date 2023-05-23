import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Container, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'
import { PencilSquare, PlusCircle, Trash } from 'react-bootstrap-icons'
import toast from 'react-hot-toast'
import ConfirmActionModal from '../Commons/ConfirmActionModal'
import useFullPageLoader from '../../hooks/useFullPageLoader'
import { MODAL_HELPER_TEXT } from '../../utils/constants'
import NoScriptsMessage from '../NoScriptsMessage'

import UpsertInfoFieldModal from './UpsertInfoFieldModal'
import style from './index.module.css'
function InfoPage({
  getFieldsMethod,
  createFieldMethod,
  editFieldsMethod,
  removeFieldsMethod,
  isAdmin,
}) {
  const [modal, setModal] = useState(false)
  const [infoFields, setInfoFields] = useState([])
  const [isFieldsUpdated, setFieldsUpdated] = useState(false)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setFieldsUpdated(false)
      await getFieldsMethod(setInfoFields)
      hideLoader()
    }

    fetchData()
  }, [isFieldsUpdated])

  const showCreateInfoFieldModal = () => {
    setModal(
      <UpsertInfoFieldModal
        setModal={setModal}
        showLoader={showLoader}
        hideLoader={hideLoader}
        createFieldMethod={createFieldMethod}
        editFieldsMethod={editFieldsMethod}
        setInfoFieldUpdated={setFieldsUpdated}
        infoFields={infoFields}
        toast={toast}
      />
    )
  }

  const showEditInfoFieldModal = (infoField) => {
    setModal(
      <UpsertInfoFieldModal
        setModal={setModal}
        showLoader={showLoader}
        hideLoader={hideLoader}
        createFieldMethod={createFieldMethod}
        editFieldsMethod={editFieldsMethod}
        setInfoFieldUpdated={setFieldsUpdated}
        infoFields={infoFields}
        toast={toast}
        infoField={infoField}
      />
    )
  }

  const showRemoveModal = (fieldId) => {
    const action = async () => {
      showLoader()
      await removeFieldsMethod(fieldId)
      setFieldsUpdated(true)
      setModal(false)
    }

    const RemoveFieldButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <Trash className="button-icon" /> Remove
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={RemoveFieldButton}
        helperText={MODAL_HELPER_TEXT.REMOVE_INFO_FIELD}
      />
    )
  }

  let noScriptsMessage

  if (!loader && infoFields.length === 0) {
    noScriptsMessage = isAdmin ? (
      <h1>You haven't created any scripts yet.</h1>
    ) : (
      <NoScriptsMessage />
    )
  }

  return (
    <>
      {modal}
      {loader}
      <Container fluid="xxl" className={loader ? 'blur' : ''}>
        {!loader && infoFields.length > 0 && <h2>My Info Fields</h2>}
        <Row>
          <Col>
            <Button
              className="float-end"
              style={{ marginBottom: '10px' }}
              variant="success"
              onClick={showCreateInfoFieldModal}
            >
              <PlusCircle className="button-icon" /> Create Field
            </Button>
          </Col>
        </Row>

        {!loader && infoFields.length > 0 && (
          <Table bordered>
            <thead>
              <tr>
                <th>Shortcode</th>
                <th>Value</th>
                <th width={400}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {infoFields.map((infoField) => (
                <tr key={infoField.field}>
                  <td>{infoField.shortcode}</td>
                  <td>{infoField.value}</td>
                  <td className={style.actions}>
                    <Button
                      variant="primary"
                      className="mx-2"
                      onClick={() => showEditInfoFieldModal(infoField)}
                    >
                      <PencilSquare className="button-icon" /> Edit
                    </Button>
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="bottom"
                      overlay={
                        infoField?.scripts?.length === 0 ? (
                          <></>
                        ) : (
                          <Tooltip className="overlay-tooltip">
                            You can't delete this field, it's used in script
                          </Tooltip>
                        )
                      }
                    >
                      <div>
                        <Button
                          disabled={infoField?.scripts?.length > 0}
                          variant="danger"
                          onClick={() => showRemoveModal(infoField.field)}
                        >
                          <Trash className="button-icon" /> Delete
                        </Button>
                      </div>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {noScriptsMessage}
      </Container>
    </>
  )
}

InfoPage.propTypes = {
  getFieldsMethod: PropTypes.func.isRequired,
  createFieldMethod: PropTypes.func.isRequired,
  editFieldsMethod: PropTypes.func.isRequired,
  removeFieldsMethod: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
}

InfoPage.defaultProps = {
  isAdmin: false,
}
export default InfoPage
