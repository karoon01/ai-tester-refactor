import { useForm } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import { FiLogIn } from 'react-icons/fi'
import PropTypes from 'prop-types'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { login, register } from '../../services/authService'
import { INPUT_TYPES, LOCAL_STORAGE } from '../../utils/constants'
import HookFormControllerField from '../HookForm/ControllerField'
import GoogleAuthButton from './GoogleAuthButton'

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function AuthForm({ toast, setToken, onLogin, isLoginForm, setIsLoginForm }) {
  const changeForm = () => setIsLoginForm((current) => !current)

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values) => {
    const auth = async () => {
      if (isLoginForm) {
        await login(values, (data) => {
          localStorage.setItem(LOCAL_STORAGE.TOKEN, data.token)
          setToken(data.token)
          onLogin()
        })

        return 'Successfully logged in'
      } else {
        await register(values, () => {
          reset()
          changeForm()
        })

        return 'The verification letter has been sent to you. Please, verify your email and then login'
      }
    }

    await toast.promise(auth(), {
      loading: 'Authorizing...',
      success: (message) => message,
      error: (err) => `Something went wrong!\n${err}`,
    })
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <HookFormControllerField
          inputType={INPUT_TYPES.FORM_CONTROL}
          control={control}
          name="email"
          label="E-Mail"
          rules={{
            required: {
              value: true,
              message: 'Email is required',
            },
            pattern: {
              value: emailPattern,
              message: 'Invalid email address',
            },
          }}
          placeholder="Enter email address here"
          className="mt-3"
        />

        <HookFormControllerField
          inputType={INPUT_TYPES.PASSWORD}
          control={control}
          name="password"
          placeholder="Enter password here"
          label="Password"
          rules={{
            required: {
              value: true,
              message: 'Password is required',
            },
            minLength: {
              value: 6,
              message: 'Too short password',
            },
            maxLength: {
              value: 50,
              message: 'Too long password',
            },
          }}
        />
        <Form.Group className="mt-3">
          <Button type="submit" variant="outline-primary" className="float-start">
            <FiLogIn className="button-icon" /> {isLoginForm ? 'Sign In' : 'Sign Up'}
          </Button>
          <Button variant="link" onClick={changeForm} className="float-end">
            {isLoginForm ? 'Sign Up' : 'Back to Login'}
          </Button>
        </Form.Group>
      </Form>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_CLIENT_ID}>
        <GoogleAuthButton toast={toast} setToken={setToken} onLogin={onLogin} />
      </GoogleOAuthProvider>
    </>
  )
}

AuthForm.propTypes = {
  toast: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
}

export default AuthForm
