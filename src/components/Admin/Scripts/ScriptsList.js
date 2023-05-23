import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Col, Container, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { PencilSquare, PlusCircle, Trash } from 'react-bootstrap-icons'
import Pagination from '../Layout/Pagination'

import ConfirmActionModal from '../../Commons/ConfirmActionModal'
import { getAllScripts, removeScript } from '../../../services/admin/scriptsService'
import useFullPageLoader from '../../../hooks/useFullPageLoader'
import { DEFAULT_ITEMS_PER_PAGE, MODAL_HELPER_TEXT } from '../../../utils/constants'
import PublishButton from './PublishButton'
import style from './index.module.css'

const ScriptsList = () => {
  const [modal, setModal] = useState(false)
  const [isVerified, setIsVerified] = useState(true)
  const [scripts, setScripts] = useState([])
  const [scriptsTotalLength, setScriptsTotalLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scriptUpdated, setScriptUpdated] = useState(false)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setScriptUpdated(false)

      await getAllScripts(
        currentPage,
        DEFAULT_ITEMS_PER_PAGE,
        isVerified,
        setScripts,
        setScriptsTotalLength
      )
      hideLoader()
    }

    fetchData()
  }, [currentPage, isVerified, scriptUpdated])

  const handlePaginationClick = (page) => setCurrentPage(page)

  const handleTabChange = (tab) => {
    return tab === 'verified' ? setIsVerified(true) : setIsVerified(false)
  }

  const showDeleteModal = (scriptId) => {
    const action = async () => {
      showLoader()
      await removeScript(scriptId)
      if (scriptsTotalLength - 1 === DEFAULT_ITEMS_PER_PAGE) setCurrentPage(currentPage - 1)
      setScriptUpdated(true)
      setModal(false)
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

  const redirectOnScriptDetail = (id) => router.push(`/admin/scripts/${id}`)

  return (
    <>
      {loader}
      {modal}
      <Container fluid="xxl" className={`mt-5 ${loader ? 'blur' : ''}`}>
        <Tabs
          defaultActiveKey="verified"
          id="fill-tab-example"
          className="mb-3"
          fill
          onSelect={handleTabChange}
        >
          <Tab eventKey="verified" title="Admin's Scripts" />
          <Tab eventKey="users" title="User's Scripts" />
        </Tabs>

        {isVerified && (
          <Row>
            <Col>
              <Button
                className="float-end"
                style={{ marginBottom: '10px' }}
                variant="success"
                onClick={() => router.push('/admin/scripts/create')}
              >
                <PlusCircle className="button-icon" /> Create
              </Button>
            </Col>
          </Row>
        )}
        <Table bordered hover responsive="sm" className="mt-5">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Author</th>
              <th>Installs</th>
              <th>Likes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((script, index) => (
              <tr key={index}>
                <td
                  className={`${style.title} clickable-item`}
                  onClick={() => redirectOnScriptDetail(script._id)}
                >
                  {script.title}
                </td>
                <td className="clickable-item" onClick={() => redirectOnScriptDetail(script._id)}>
                  {script.category?.name ?? 'Not Specified'}
                </td>
                <td className="clickable-item" onClick={() => redirectOnScriptDetail(script._id)}>
                  {script.type}
                </td>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${script.author._id}`)}
                >
                  {script.author.email}
                </td>
                <td className="clickable-item" onClick={() => redirectOnScriptDetail(script._id)}>
                  {script.installs}
                </td>
                <td className="clickable-item" onClick={() => redirectOnScriptDetail(script._id)}>
                  {script.likes}
                </td>
                <td>
                  <div className={style.buttonContainer}>
                    <PublishButton
                      script={script}
                      showLoader={showLoader}
                      setScriptUpdated={setScriptUpdated}
                    />
                    {isVerified && (
                      <Button
                        variant="primary"
                        onClick={() => router.push(`/admin/scripts/edit/${script._id}`)}
                      >
                        <PencilSquare className="button-icon" />
                      </Button>
                    )}

                    <Button variant="danger" onClick={() => showDeleteModal(script._id)}>
                      <Trash className="button-icon" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
          totalItems={scriptsTotalLength}
          onPageChange={handlePaginationClick}
        />
      </Container>
    </>
  )
}

export default ScriptsList
