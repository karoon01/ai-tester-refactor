import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, Stack } from 'react-bootstrap'

import AuthForm from '../components/Auth/AuthForm'

const Auth = ({ toast, setToken }) => {
  const [isLoginForm, setIsLoginForm] = useState(true)

  const router = useRouter()

  const onLogin = () => router.push('/')

  return (
    <Container fluid="lg">
      <Stack className="col-md-5 mx-auto mt-5">
        <h1 className="mb-3">{isLoginForm ? 'Login' : 'Registration'}</h1>
        <AuthForm
          toast={toast}
          setToken={setToken}
          isLoginForm={isLoginForm}
          setIsLoginForm={setIsLoginForm}
          onLogin={onLogin}
        />
      </Stack>
    </Container>
  )
}

Auth.title = 'Authorization'
Auth.isNotLoggedIn = true

Auth.propTypes = {
  toast: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
}

export default Auth
