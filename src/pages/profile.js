import React from 'react'
import { Container } from 'react-bootstrap'
import ApiKeyForm from '../components/ApiKeyForm'
import useFullPageLoader from '../hooks/useFullPageLoader'

function Profile() {
  const [loader, showLoader, hideLoader] = useFullPageLoader()
  return (
    <>
      {loader}
      <Container fluid="xxl" className={`mt-5 ${loader ? 'blur' : ''}`}>
        <h2>Profile</h2>
        <ApiKeyForm showLoader={showLoader} hideLoader={hideLoader} />
      </Container>
    </>
  )
}

Profile.title = 'User Profile'
Profile.isOnlyUser = true

export default Profile
