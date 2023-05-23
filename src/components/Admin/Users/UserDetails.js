import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { ArrowLeftCircle, PersonFillX } from 'react-bootstrap-icons'
import ConfirmActionModal from '../../Commons/ConfirmActionModal'
import useFullPageLoader from '../../../hooks/useFullPageLoader'
import { blockUser, getUserById } from '../../../services/admin/usersService'
import { MODAL_HELPER_TEXT } from '../../../utils/constants'
import style from './UserDetails.module.css'

const UserDetails = () => {
  const [modal, setModal] = useState(false)
  const [user, setUser] = useState([])
  const [userUpdated, setUserUpdated] = useState(false)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()
  const { userId } = router.query

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setUserUpdated(false)
      await getUserById(userId, setUser)
      hideLoader()
    }
    if (router.isReady) fetchData()
  }, [userUpdated, router.isReady])

  const showDeleteModal = () => {
    const action = async () => {
      showLoader()
      await blockUser(userId)
      setUserUpdated(true)
      setModal(false)
      hideLoader()
    }

    const BlockUserButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <PersonFillX className="button-icon" /> Block
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={BlockUserButton}
        helperText={MODAL_HELPER_TEXT.BLOCK_USER}
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
              onClick={router.back}
            />
          </Col>
        </Row>
        <Row>
          <h1>User details</h1>
        </Row>
        <Table bordered style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
          <tbody className={style.buttonTbody}>
            <tr>
              <td />
              <td>
                {user.userStatus !== 'Blocked' ? (
                  <Button
                    className="float-end mb-2"
                    variant="outline-danger"
                    onClick={showDeleteModal}
                  >
                    <PersonFillX className="button-icon" /> Block
                  </Button>
                ) : (
                  <Button className="float-end" variant="secondary" disabled>
                    Blocked
                  </Button>
                )}
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>Id</td>
              <td>{user._id}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{user.userStatus}</td>
            </tr>
            <tr>
              <td>Billing Status</td>
              <td>{user.billingStatus}</td>
            </tr>
            <tr>
              <td>Is Authorized By Google</td>
              <td>{user.isAuthorizedByGoogle ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Remaining Generations</td>
              <td>{user.remainingGenerations}</td>
            </tr>
            <tr>
              <td>Max Scripts Amount</td>
              <td>{user.maxScriptsAmount}</td>
            </tr>
            <tr>
              <td>OpenAi apikey</td>
              <td>{user.openAiApiKey ?? '-'}</td>
            </tr>
            <tr>
              <td>Is sponsored</td>
              <td>{user.isSponsored ? 'Sponsored' : 'Not sponsored'}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  )
}

export default UserDetails
