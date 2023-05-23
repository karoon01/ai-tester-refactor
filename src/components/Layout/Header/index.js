import Link from 'next/link'
import { decode } from 'jsonwebtoken'
import PropTypes from 'prop-types'
import { Dropdown, Nav, Navbar } from 'react-bootstrap'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { LOCAL_STORAGE, PROJECT_NAME } from '../../../utils/constants'
import { ProfileIcon } from '../../../utils/icons'
import style from './index.module.css'
import DropdownItem from './DropdownItem'

function Header({ setToken, token, toast, isOnlyUser }) {
  const [isShownDropdown, setIsShownDropdown] = useState(false)

  const router = useRouter()

  const dropdownRef = useRef(null)

  const user = token && decode(token)
  const onClickLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE.TOKEN)
    setToken('')
    toast.success('Logged out')
    setIsShownDropdown(false)
    if (isOnlyUser) {
      router.push('/auth')
    } else {
      router.reload(window.location.pathname)
    }
  }

  const redirect = (url) => {
    router.push(url)
    setIsShownDropdown(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShownDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const profileDropdownItems = [
    {
      text: 'Profile',
      onClick: () => redirect(`/profile`),
    },
    {
      text: 'My Scripts',
      onClick: () => redirect(`/my-scripts`),
    },
    {
      text: 'MyInfo Fields',
      onClick: () => redirect(`/my-info`),
    },
  ]

  return (
    <Navbar collapseOnSelect className={style.header}>
      <Link href="/src/pages" className={style.navbarLogo}>
        {PROJECT_NAME}
      </Link>
      {token ? (
        <Navbar.Collapse className="justify-content-end">
          <div ref={dropdownRef}>
            <div onClick={() => setIsShownDropdown(true)} className={style.profile}>
              <ProfileIcon />
            </div>

            <Dropdown.Menu show={isShownDropdown} className={style.dropdown}>
              <Dropdown.Header className={style.dropdownItem + ' ' + style.dropdownHeader}>
                {user.email}
              </Dropdown.Header>
              <Dropdown.Divider className={style.dropdownDivider} />
              {profileDropdownItems.map((item) => (
                <DropdownItem key={item.text} text={item.text} onClick={item.onClick} />
              ))}
              <>
                <Dropdown.Divider className={style.dropdownDivider} />
                <DropdownItem
                  text={
                    <>
                      <FiLogOut /> Log Out
                    </>
                  }
                  onClick={onClickLogout}
                />
              </>
            </Dropdown.Menu>
          </div>
        </Navbar.Collapse>
      ) : (
        <Navbar.Collapse className="justify-content-end">
          <Nav className={style.login} onClick={() => router.push('/auth')}>
            <FiLogIn /> Login
          </Nav>
        </Navbar.Collapse>
      )}
    </Navbar>
  )
}

Header.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired,
  toast: PropTypes.func.isRequired,
  isOnlyUser: PropTypes.bool,
}

Header.defaultProps = {
  isOnlyUser: false,
}

export default Header
