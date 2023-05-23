import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Row, Table } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { PersonCheck, PersonDash, PersonFillX } from 'react-bootstrap-icons'

import Pagination from '../Layout/Pagination'
import ConfirmActionModal from '../../Commons/ConfirmActionModal'
import {
  blockUser,
  changeUserSponsoring,
  getAllUsersPaginated,
} from '../../../services/admin/usersService'
import { DEFAULT_ITEMS_PER_PAGE, MODAL_HELPER_TEXT } from '../../../utils/constants'
import useFullPageLoader from '../../../hooks/useFullPageLoader'

function UsersList() {
  const [modal, setModal] = useState(false)
  const [users, setUsers] = useState([])
  const [userUpdated, setUserUpdated] = useState(false)
  const [usersTotalLength, setUsersTotalLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setUserUpdated(false)
      await getAllUsersPaginated(currentPage, DEFAULT_ITEMS_PER_PAGE, setUsers, setUsersTotalLength)
      hideLoader()
    }

    fetchData()
  }, [currentPage, userUpdated])

  const router = useRouter()

  const handlePaginationClick = (page) => setCurrentPage(page)

  const showDeleteModal = (userId) => {
    const action = async (userId) => {
      showLoader()
      await blockUser(userId)
      setUserUpdated(true)
      setModal(false)
    }

    const BlockUserButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={() => action(userId)}>
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

  const handleChangeSponsorStatus = async (userId) => {
    showLoader()
    await changeUserSponsoring(userId)
    setUserUpdated(true)
    hideLoader()
  }

  return (
    <>
      {loader}
      {modal}
      <Container fluid="xxl" className={`mt-5 ${loader ? 'blur' : ''}`}>
        <Row>
          <h1>Users</h1>
        </Row>
        <Table bordered hover responsive="sm" className="mt-5">
          <thead>
            <tr>
              <th>Email</th>
              <th>User Status</th>
              <th>Billing Status</th>
              <th>Sponsoring</th>
              <th>Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  {user.email}
                </td>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  {user.userStatus}
                </td>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  {user.billingStatus}
                </td>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  {user.isSponsored ? 'Sponsored' : 'Not Sponsored'}
                </td>
                <td
                  className="clickable-item"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  {user._id}
                </td>
                <td>
                  <Form.Group style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {user.userStatus !== 'Blocked' ? (
                      <Button variant="outline-danger" onClick={() => showDeleteModal(user._id)}>
                        <PersonFillX className="button-icon" /> Block
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        Blocked
                      </Button>
                    )}
                    <Button
                      variant={user.isSponsored ? 'outline-primary' : 'outline-success'}
                      onClick={() => handleChangeSponsorStatus(user._id)}
                    >
                      {user.isSponsored ? (
                        <>
                          <PersonDash /> Disable Sponsoring
                        </>
                      ) : (
                        <>
                          <PersonCheck /> Enable Sponsoring
                        </>
                      )}
                    </Button>
                  </Form.Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
          totalItems={usersTotalLength}
          onPageChange={handlePaginationClick}
        />
      </Container>
    </>
  )
}

export default UsersList
