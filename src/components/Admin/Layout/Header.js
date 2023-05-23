import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FiLogOut } from 'react-icons/fi'
import Link from 'next/link'

import { LOCAL_STORAGE, PROJECT_NAME } from '../../../utils/constants'

function Header({ setToken, token }) {
  const onClickLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ADMIN_TOKEN)
    setToken('')
  }

  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Nav.Link as={Link} href={token ? '/admin/users' : '/'} eventKey="1">
            {PROJECT_NAME}
          </Nav.Link>
        </Navbar.Brand>
        {token ? (
          <>
            <Navbar.Toggle aria-controls="navbarScroll" data-bs-target="#navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto">
                <Nav.Link
                  as={Link}
                  href="/admin/users"
                  eventKey="2"
                  active={location.pathname.startsWith('/admin/users')}
                >
                  Users
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/admin/scripts"
                  eventKey="3"
                  active={location.pathname.startsWith('/admin/scripts')}
                >
                  Scripts
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/admin/my-info"
                  eventKey="4"
                  active={location.pathname.startsWith('/admin/my-info')}
                >
                  My Info
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/admin/categories"
                  eventKey="4"
                  active={location.pathname.startsWith('/admin/categories')}
                >
                  Categories
                </Nav.Link>
              </Nav>
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <Nav.Link as={Link} href="/admin/login" onClick={onClickLogout}>
                    <FiLogOut /> Logout
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar.Collapse>
          </>
        ) : null}
      </Container>
    </Navbar>
  )
}

export default Header
