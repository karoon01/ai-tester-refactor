import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { googleAuth } from '../../services/authService'
import { GoogleIcon } from '../../utils/icons'
import { LOCAL_STORAGE } from '../../utils/constants'

function GoogleAuthButton({ toast, setToken, onLogin }) {
  const authByGoogle = useGoogleLogin({
    onSuccess: async (token) => {
      const verifyToken = async () => {
        await googleAuth(token.access_token, (data) => {
          localStorage.setItem(LOCAL_STORAGE.TOKEN, data.token)
          setToken(data.token)
        })

        return 'Successfully authorized by Google'
      }

      await toast.promise(verifyToken(), {
        loading: 'Authorizing...',
        success: (message) => message,
        error: (err) => `Something went wrong!\n${err}`,
      })

      onLogin()
    },
    onError: (err) => {
      toast.error(err)
    },
  })
  return (
    <Button
      className="mt-3"
      id="google-button"
      variant="light"
      style={{ borderRadius: '80px', width: '100%' }}
      onClick={authByGoogle}
    >
      <GoogleIcon />
      {' Sign in with Google'}
    </Button>
  )
}

GoogleAuthButton.propTypes = {
  toast: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  onLogin: PropTypes.func,
}

export default GoogleAuthButton
