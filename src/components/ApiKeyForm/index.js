import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Save } from 'react-bootstrap-icons'
import { getUserProfile, saveOpenAiApikey } from '../../services/user/userService'
import HookFormControllerField from '../HookForm/ControllerField'
import { INPUT_TYPES } from '../../utils/constants'

function ApiKeyForm({ showLoader, hideLoader, isFullSizeForm, afterSubmit }) {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      openAiApiKey: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const fetchData = async () => {
      showLoader()

      await getUserProfile((data) => {
        Object.keys(data).forEach((key) => {
          setValue(`${key}`, data[key])
        })
      })

      hideLoader()
    }

    fetchData()
  }, [])

  const onSubmit = async (values) => {
    await toast.promise(saveOpenAiApikey(values), {
      loading: 'Verifying...',
      success: () => 'Api Key successfully saved',
      error: (err) => `Something went wrong!\n${err}`,
    })

    afterSubmit()
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row style={{ textAlign: 'left' }}>
          <Col lg={isFullSizeForm ? 12 : 6}>
            <HookFormControllerField
              inputType={INPUT_TYPES.FORM_CONTROL}
              name="openAiApiKey"
              control={control}
              placeholder="Enter here your OpenAI apikey"
              label="OpenAI apikey"
              rules={{
                required: {
                  value: true,
                  message: 'Api Key is required',
                },
              }}
            />
            <Button
              type="submit"
              variant="outline-success"
              onClick={handleSubmit(onSubmit)}
              className="mt-3"
            >
              <Save /> Save
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

ApiKeyForm.propTypes = {
  showLoader: PropTypes.func.isRequired,
  hideLoader: PropTypes.func.isRequired,
  isFullSizeForm: PropTypes.bool,
  afterSubmit: PropTypes.func,
}

ApiKeyForm.defaultProps = {
  isFullSizeForm: false,
}

export default ApiKeyForm
