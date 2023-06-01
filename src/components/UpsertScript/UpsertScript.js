import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import { ArrowLeftCircle } from 'react-bootstrap-icons'

import {
  INPUT_TYPES,
  requiredForNextStep,
  requiredForSaveFields,
  steps,
  TOOLTIP_HELP_TEXT,
} from '../../utils/constants'
import { getAllDeepNestedCategories } from '../../services/categoriesService'
import { useOnLeavePageConfirmation } from '../../hooks/handleUserLeaveConfirmation'
import useFullPageLoader from '../../hooks/useFullPageLoader'
import { useOnLeavePageLoaderHide } from '../../hooks/handleUserLeaveOnRunning'
import {
  getNotFilledFieldsMessage,
  isFieldsValid,
  isFormValid,
  validateScriptInput,
} from '../../utils/utils'
import HelpTooltip from '../Commons/HelpTooltip'
import HookFormControllerField from '../HookForm/ControllerField'
import MyInfoFieldsFormGroup from './MyInfoFieldsFormGroup'
import CustomFieldsFormGroup from './CustomFieldsFormGroup'
import FormStepperButtons from './FormStepperButtons'
import TryScriptButton from './TryScriptButton'

const StepperComponent = dynamic(() => import('./CustomStepper'), {
  ssr: false,
})

function UpsertScript({
  sendRequest,
  tryScriptMethod,
  isEditing,
  isAdmin,
  getAllUserInfoFields,
  getScriptById,
  getUserInfoFields,
  getScriptExample,
}) {
  const [modal, setModal] = useState(false)
  const [userInfoFields, setUserInfoFields] = useState([])
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [fields, setFields] = useState([])
  const [infoFields, setInfoFields] = useState([])
  const [isScriptSaving, setScriptSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [toastId, setToastId] = useState()

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()
  const { scriptId } = router.query

  const textArea = useRef(null)
  const unsavedChanges = useRef(false)

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      value: '',
      description: '',
      source: '',
      category: null,
      fields: [],
      result: '',
    },
    mode: 'onChange',
  })

  const values = watch()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      if (!isEditing || (router.isReady && isEditing)) {
        await getAllDeepNestedCategories(setCategories)
        await getAllUserInfoFields(setUserInfoFields)

        if (router.isReady && isEditing) {
          await setScriptData(scriptId)
        }
        hideLoader()
      }
    }

    fetchData()
  }, [router.isReady])

  useOnLeavePageLoaderHide(toastId, setToastId)
  useOnLeavePageConfirmation(setModal, unsavedChanges, router)

  //Load data for Edit Script Page
  const setScriptData = async (scriptId) => {
    showLoader()
    let scriptData
    await getScriptById(scriptId, (data) => {
      scriptData = data
    })
    const userFields = await getUserInfoFields(scriptId)
    const scriptExample = await getScriptExample(scriptId)

    Object.keys(scriptData?.script).map((key) => {
      setValue(
        `${key}`,
        key === 'category' ? scriptData?.script[key]?._id : scriptData?.script[key]
      )
    })
    setCurrentCategory(scriptData?.script['category']?.name)

    if (scriptExample.data) {
      setValue('fields', scriptExample.data.exampleFields)
      setValue('result', scriptExample.data.exampleOutput)
    }

    const fields = getValues('fields').reduce(
      (acc, currentField) => {
        currentField.isUserInfoField
          ? acc.infoFields.push(currentField)
          : acc.customFields.push(currentField)
        return acc
      },
      { customFields: [], infoFields: [] }
    )

    setInfoFields(scriptExample.data ? fields.infoFields : userFields.data)
    setFields(fields.customFields)

    hideLoader()
  }

  const handleChanges = () => {
    unsavedChanges.current = true
  }

  const handleMoveBetweenSteps = (value) => {
    setCurrentStep(currentStep + value)
  }

  const onSubmit = async () => {
    if (!isFieldsValid(getValues, fields, infoFields)) return

    const allFields = [...fields, ...infoFields]
    setValue('fields', allFields)

    const isValid = isFormValid(requiredForSaveFields, { fields, infoFields, values })

    const notFilledFieldsMessage = getNotFilledFieldsMessage(allFields)

    if (notFilledFieldsMessage) {
      return toast.error(notFilledFieldsMessage)
    }

    unsavedChanges.current = false

    const saveScript = async () => {
      setScriptSaving(true)
      await sendRequest(getValues(), isValid, scriptId)
      setScriptSaving(false)

      return isValid
        ? isEditing
          ? 'Script successfully updated!'
          : 'Script successfully created!'
        : 'Script saved as a draft!'
    }

    await toast.promise(saveScript(), {
      loading: 'Saving...',
      success: (message) => message,
      error: (err) => `Something went wrong!\n${err}`,
    })

    await router.replace(isAdmin ? '/admin/scripts' : '/my-scripts')
  }

  const handleBackButton = unsavedChanges.current ? () => router.push('/') : () => router.back()

  return (
    <>
      {loader}
      <Toaster />
      {modal}
      <Container fluid="xxl" className={`mt-5 mb-5 ${loader ? 'blur' : ''}`}>
        <Row>
          <Col>
            <ArrowLeftCircle
              className="float-start clickable-item back-button"
              size={30}
              onClick={handleBackButton}
            />
          </Col>
        </Row>
        <Row>
          <h1>{isEditing ? 'Edit Script' : 'Create Script'}</h1>
        </Row>

        <StepperComponent currentStep={currentStep} steps={steps} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <>
              <Card>
                <Card.Body>
                  <Row className="m-2" style={{ textAlign: 'left' }}>
                    <Col lg="6">
                      <HookFormControllerField
                        inputType={INPUT_TYPES.FORM_CONTROL}
                        control={control}
                        name="title"
                        label={<b>Title</b>}
                        rules={{
                          required: {
                            value: true,
                            message: 'Title is required',
                          },
                        }}
                        placeholder="Enter title"
                        onInputChange={handleChanges}
                      />
                      <HookFormControllerField
                        inputType={INPUT_TYPES.FORM_CONTROL}
                        control={control}
                        name="value"
                        label={<b>Script</b>}
                        rules={{
                          required: {
                            value: true,
                            message: 'Script is required',
                          },
                          validate: validateScriptInput,
                        }}
                        placeholder="Enter script"
                        onInputChange={handleChanges}
                        controlRef={textArea}
                        as="textarea"
                        rows={16}
                        className="mt-3"
                      />
                      <MyInfoFieldsFormGroup
                        textArea={textArea}
                        infoFields={infoFields}
                        fields={fields}
                        userInfoFields={userInfoFields}
                        clearErrors={clearErrors}
                        trigger={trigger}
                        setModal={setModal}
                        setInfoFields={setInfoFields}
                        setValue={setValue}
                        setFields={setFields}
                      />
                      <TryScriptButton
                        errors={errors}
                        fields={fields}
                        infoFields={infoFields}
                        values={values}
                        tryScriptMethod={tryScriptMethod}
                        showLoader={showLoader}
                        hideLoader={hideLoader}
                        setModal={setModal}
                        getValues={getValues}
                        setValue={setValue}
                        setToastId={setToastId}
                      />
                      {getValues('result') !== '' && (
                        <HookFormControllerField
                          inputType={INPUT_TYPES.SCRIPT_RESULT}
                          control={control}
                          name="result"
                          placeholder="Reslt"
                        />
                      )}
                    </Col>
                    <Col lg="6">
                      <CustomFieldsFormGroup
                        textArea={textArea}
                        infoFields={infoFields}
                        fields={fields}
                        userInfoFields={userInfoFields}
                        errors={errors}
                        clearErrors={clearErrors}
                        trigger={trigger}
                        setModal={setModal}
                        setInfoFields={setInfoFields}
                        setValue={setValue}
                        setFields={setFields}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <FormStepperButtons
                isNext
                isEditing={isEditing}
                isScriptSaving={isScriptSaving}
                errors={errors}
                fields={fields}
                infoFields={infoFields}
                values={values}
                onMoveBetweenSteps={() => {
                  isFormValid(requiredForNextStep, { fields, infoFields, values }) &&
                    isFieldsValid() &&
                    handleMoveBetweenSteps(1)
                }}
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <Card>
                <Card.Body>
                  <Row className="justify-content-center m-2" style={{ textAlign: 'left' }}>
                    <Col lg={12}>
                      <HookFormControllerField
                        inputType={INPUT_TYPES.CATEGORY_SELECT}
                        name="category"
                        control={control}
                        label={<b>Category</b>}
                        categories={categories}
                        setValue={setValue}
                        formFieldName="category"
                        trigger={trigger}
                        className="mt-3"
                        defaultValue={currentCategory}
                      />
                      <HookFormControllerField
                        inputType={INPUT_TYPES.FORM_CONTROL}
                        control={control}
                        name="description"
                        label={<b>Description</b>}
                        placeholder="Enter description"
                        onInputChange={handleChanges}
                        as="textarea"
                        rows={10}
                      />
                      <HookFormControllerField
                        inputType={INPUT_TYPES.FORM_CONTROL}
                        control={control}
                        name="source"
                        label={
                          <>
                            <b>Source</b>{' '}
                            <HelpTooltip
                              tooltipText={TOOLTIP_HELP_TEXT.SCRIPT_SOURCE_EXPLANATION}
                            />
                          </>
                        }
                        placeholder="Enter source link"
                        onInputChange={handleChanges}
                        className="mt-3"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <FormStepperButtons
                isEditing={isEditing}
                isScriptSaving={isScriptSaving}
                errors={errors}
                fields={fields}
                infoFields={infoFields}
                values={values}
                onMoveBetweenSteps={() => handleMoveBetweenSteps(-1)}
              />
            </>
          )}
        </Form>
      </Container>
    </>
  )
}

UpsertScript.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  getAllUserInfoFields: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
}

export default UpsertScript
