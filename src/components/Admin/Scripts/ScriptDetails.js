import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { ArrowLeftCircle, PencilSquare, Trash } from 'react-bootstrap-icons'
import { getScriptById, removeScript } from '../../../services/admin/scriptsService'
import ConfirmActionModal from '../../Commons/ConfirmActionModal'
import useFullPageLoader from '../../../hooks/useFullPageLoader'
import { MODAL_HELPER_TEXT } from '../../../utils/constants'
import PublishButton from './PublishButton'
import style from './index.module.css'

function ScriptDetails() {
  const [modal, setModal] = useState(false)
  const [script, setScript] = useState({})
  const [scriptUpdated, setScriptUpdated] = useState(false)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()
  const { scriptId } = router.query

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setScriptUpdated(false)
      await getScriptById(scriptId, ({ script }) => setScript(script))

      hideLoader()
    }
    if (router.isReady) fetchData()
  }, [scriptUpdated, router.isReady])

  const showDeleteModal = (scriptId) => {
    const action = async () => {
      showLoader()
      await removeScript(scriptId)
      setScriptUpdated(true)
      setModal(false)
      router.back()
      hideLoader()
    }

    const RemoveButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <Trash className="button-icon" /> Delete
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={RemoveButton}
        helperText={MODAL_HELPER_TEXT.REMOVE_SCRIPT}
      />
    )
  }

  return (
    <>
      {loader}
      {modal}
      <Container fluid="xxl" className={`mt-3 ${loader ? 'blur' : ''}`}>
        <Row>
          <Col>
            <ArrowLeftCircle
              className="float-start clickable-item back-button"
              size={30}
              onClick={() => router.back()}
            />
          </Col>
        </Row>
        <Row>
          <h1>Script details</h1>
        </Row>

        <Row className="justify-content-end my-3">
          <Col xs={2}>
            <PublishButton
              script={script}
              showLoader={showLoader}
              setScriptUpdated={setScriptUpdated}
            />
          </Col>
          <Col xs="auto">
            {script.isVerified && (
              <Button
                className=""
                variant="outline-primary"
                onClick={() => router.push(`/admin/scripts/edit/${script._id}`)}
              >
                <PencilSquare className="button-icon" />
              </Button>
            )}
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" onClick={() => showDeleteModal(script._id)}>
              <Trash className="button-icon" />
            </Button>
          </Col>
        </Row>

        <Table bordered>
          <tbody className={style.tableBody}>
            <tr>
              <td>Id</td>
              <td>{script._id}</td>
            </tr>
            <tr>
              <td>Title</td>
              <td>{script.title}</td>
            </tr>
            <tr>
              <td>Category</td>
              <td>{script.category?.name}</td>
            </tr>
            <tr>
              <td>Value</td>
              <td>{script.value}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{script.type}</td>
            </tr>
            <tr>
              <td>Verification</td>
              <td>{script.isVerified ? 'Verified' : 'Not verified'}</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>{script.author?.email}</td>
            </tr>
            <tr>
              <td>Likes</td>
              <td>{script.likes}</td>
            </tr>
            <tr>
              <td>Installs</td>
              <td>{script.installs}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  )
}

export default ScriptDetails
