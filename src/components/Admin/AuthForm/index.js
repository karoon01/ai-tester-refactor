import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Button, Container, Form, Stack } from 'react-bootstrap'
import { FiLogIn } from 'react-icons/fi'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { login } from '../../../services/admin/authService'
import { INPUT_TYPES, LOCAL_STORAGE } from '../../../utils/constants'
import HookFormControllerField from '../../HookForm/ControllerField'

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function AuthForm({ setToken }) {
  const [error, setError] = useState('')
  const router = useRouter()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values) => {
    await login(
      values,
      ({ token }) => {
        localStorage.setItem(LOCAL_STORAGE.ADMIN_TOKEN, token)
        setToken(token)
        router.push('/admin/users')
      },
      (error) => setError(error)
    )
  }

  return (
    <Container fluid="lg">
      <Stack className="col-md-5 mx-auto mt-5">
        {error && (
          <Alert variant="danger">
            <b>Error</b>: {error}
          </Alert>
        )}
        <h1 className="mb-3">Sign In</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ textAlign: 'left' }}>
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
          </div>
          <Button type="submit" variant="outline-primary">
            <FiLogIn className="button-icon" /> Log In
          </Button>
        </Form>
      </Stack>
    </Container>
  )
}

AuthForm.propTypes = {
  setToken: PropTypes.func.isRequired,
}

export default AuthForm
