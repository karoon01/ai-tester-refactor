import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Col,
  Container,
  Form,
  FormGroup,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap'
import {
  ArrowClockwise,
  ArrowLeftCircle,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  JournalText,
  Save,
} from 'react-bootstrap-icons'
import { FiCopy, FiEdit, FiPlusCircle, FiXCircle } from 'react-icons/fi'

import { INPUT_TYPES, TOOLTIP_HELP_TEXT } from '../../utils/constants'
import { getAllDeepNestedCategories } from '../../services/categoriesService'
import { useOnLeavePageConfirmation } from '../../hooks/handleUserLeaveConfirmation'
import useFullPageLoader from '../../hooks/useFullPageLoader'
import { useOnLeavePageLoaderHide } from '../../hooks/handleUserLeaveOnRunning'
import { getNotFilledFieldsMessage } from '../../utils/utils'
import HelpTooltip from '../Commons/HelpTooltip'
import AutoResizableTextArea from '../AutoResizableTextArea'
import HookFormControllerField from '../HookForm/ControllerField'
import ApiKeyModal from '../ApiKeyModal'
import UpsertFieldModal from './UpsertFieldModal'
import UpsertMyInfoFieldModal from './UpsertInfoFieldModal'
import AddInfoFieldModal from './AddInfoFieldModal'
import style from './index.module.css'

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
  const [isScriptRunning, setScriptRunning] = useState(false)
  const [isScriptSaving, setScriptSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [toastId, setToastId] = useState()

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const steps = [
    { id: 0, label: 'Script Information' },
    { id: 1, label: 'Additional Information' },
  ]

  const router = useRouter()
  const { scriptId } = router.query

  const textArea = useRef(null)
  const tryRef = useRef(null)
  const unsavedChanges = useRef(false)

  const requiredForSaveFields = ['title', 'value', 'description', 'category', 'fields']
  const requiredForNextStep = ['title', 'value', 'fields']
  const requiredForTryFields = ['value', 'fields']

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

  const isFormValid = (requiredFields) => {
    if (requiredFields.includes('fields') && [...fields, ...infoFields].length === 0) {
      return false
    }

    return requiredFields.every((field) => !!values[field])
  }

  const handleChanges = () => {
    unsavedChanges.current = true
  }

  const showCreateFieldModal = () => {
    setModal(
      <UpsertFieldModal
        setModal={setModal}
        setFields={setFields}
        fields={fields}
        toast={toast}
        infoFields={infoFields}
      />
    )
  }

  const showEditFieldModal = (externalField) => {
    setModal(
      <UpsertFieldModal
        setModal={setModal}
        setFields={setFields}
        fields={fields}
        toast={toast}
        infoFields={infoFields}
        externalField={externalField}
        scriptValue={textArea}
        setFormValue={setValue}
      />
    )
  }

  const showCreateInfoFieldModal = () => {
    setModal(
      <AddInfoFieldModal
        setModal={setModal}
        setInfoFields={setInfoFields}
        infoFields={infoFields}
        fields={fields}
        toast={toast}
        userInfoFields={userInfoFields}
      />
    )
  }

  const showEditInfoFieldModal = (infoField) => {
    setModal(
      <UpsertMyInfoFieldModal
        infoField={infoField}
        toast={toast}
        setModal={setModal}
        setInfoFields={setInfoFields}
        fields={fields}
        infoFields={infoFields}
        scriptValue={textArea}
        setFormValue={setValue}
      />
    )
  }

  const setFieldValue = (key, value) => {
    const customFields = [...fields]
    customFields[key]['value'] = value
    setFields(customFields)
  }

  const insertField = (shortCode) => {
    const currentPosition = textArea.current.selectionStart

    const value = textArea.current.value

    clearErrors('script')
    setValue(
      'value',
      `${value.slice(0, currentPosition)}{${shortCode}}${value.slice(currentPosition)}`
    )
    trigger('value')
  }

  const removeField = (selectedFields, key, type) => {
    const value = textArea.current.value
    setValue('value', value.replaceAll(`{${selectedFields[key]['shortcode']}}`, ''))

    const result = selectedFields.filter((field, index) => key !== index)
    type === 'infoField' ? setInfoFields(result) : setFields(result)
  }

  const isFieldsValid = () => {
    const shortcodeRegex = /{([^}]+)}/g

    const scriptValue = getValues('value')
    const allFields = [...fields, ...infoFields]

    const fieldsFromText = scriptValue
      .match(shortcodeRegex)
      .map((shortcode) => shortcode.slice(1, -1))

    const notAddedFields = allFields.filter((field) => {
      if (scriptValue.search(`{${field.shortcode}}`) === -1) {
        return field
      }
    })

    const undefinedFields = fieldsFromText.filter(
      (field) => !allFields.some(({ shortcode }) => field === shortcode)
    )

    if (notAddedFields.length > 0) {
      toast.error(
        `Some fields are not added to text: ${notAddedFields
          .map((field) => `{${field.shortcode}}`)
          .join(', ')}`
      )
      return false
    }
    if (undefinedFields.length > 0) {
      toast.error(
        `In your script are used fields that doesn't exist: ${undefinedFields.join(', ')}`
      )
      return false
    }
    return true
  }

  const showApiKeyModal = () => {
    setModal(
      <ApiKeyModal
        setModal={setModal}
        showLoader={showLoader}
        hideLoader={hideLoader}
        afterSubmit={() => {
          tryRef.current.click()
        }}
      />
    )
  }

  const handleTryScript = async () => {
    const scriptValue = getValues('value')

    const allFields = [...fields, ...infoFields]

    const notFilledFieldsMessage = getNotFilledFieldsMessage(allFields, true)

    if (notFilledFieldsMessage) {
      return toast.error(notFilledFieldsMessage)
    }

    setValue('fields', allFields)

    if (!isFieldsValid()) return

    const executeScript = async () => {
      setScriptRunning(true)

      const setResult = (result) => {
        setValue('result', result)
      }

      await tryScriptMethod(scriptValue, allFields, setResult, showApiKeyModal)
    }

    const loadingToastId = toast.loading('Script is running...')
    setToastId(loadingToastId)
    await executeScript()
      .then(() => toast.success('Script executed successfully!'))
      .catch((err) => toast.error(`Something went wrong!\n${err}`))
      .finally(() => {
        setScriptRunning(false)
        toast.remove(loadingToastId)
        setToastId()
      })
  }

  const handleMoveBetweenSteps = (value) => {
    setCurrentStep(currentStep + value)
  }

  const onSubmit = async () => {
    if (!isFieldsValid()) return

    const allFields = [...fields, ...infoFields]
    setValue('fields', allFields)

    const isValid = isFormValid(requiredForSaveFields)

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
                          validate: (value) => {
                            if (!value.match(/^(?:[^{}]*{[^{}]*})*[^{}]*$/)) {
                              return 'All curly braces must be closed'
                            }

                            if (!value.match(/[^{}]*(?=\})/g))
                              return 'Script should have at least one variable'
                          },
                        }}
                        placeholder="Enter script"
                        onInputChange={handleChanges}
                        controlRef={textArea}
                        as="textarea"
                        rows={16}
                        className="mt-3"
                      />
                      <Form.Group className="mt-3">
                        <Form.Label>
                          <b>My Info Fields</b>
                        </Form.Label>
                        <Card>
                          <Card.Body>
                            <Button
                              className="float-end"
                              variant="outline-success"
                              onClick={showCreateInfoFieldModal}
                            >
                              <FiPlusCircle className="button-icon" /> Add
                            </Button>
                            <Form.Group>
                              <div className={style.infoBadges}>
                                {infoFields.map((field, key) => (
                                  <Badge key={field.shortcode} bg="primary" text="light">
                                    <InputGroup>
                                      <FiEdit
                                        className={style.infoBadgesEdit}
                                        size={15}
                                        onClick={() => showEditInfoFieldModal(field)}
                                      />
                                      <div
                                        className={style.infoBadgesItem}
                                        onClick={() => insertField(field.shortcode)}
                                      >
                                        {`${field.shortcode}`}
                                      </div>
                                      <CloseButton
                                        style={{ marginLeft: 4 }}
                                        onClick={() => removeField(infoFields, key, 'infoField')}
                                      />
                                    </InputGroup>
                                  </Badge>
                                ))}
                              </div>
                            </Form.Group>
                          </Card.Body>
                        </Card>
                      </Form.Group>
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="right"
                        overlay={
                          !errors.value && isFormValid(requiredForTryFields) ? (
                            <></>
                          ) : (
                            <Tooltip className="overlay-tooltip">
                              You should fill script text and fields in to try script
                            </Tooltip>
                          )
                        }
                      >
                        <Button
                          variant="primary"
                          className="mt-5 mb-3"
                          onClick={() =>
                            !errors.value && isFormValid(requiredForTryFields) && handleTryScript()
                          }
                          ref={tryRef}
                          disabled={isScriptRunning}
                        >
                          <ArrowClockwise /> Try Script
                        </Button>
                      </OverlayTrigger>
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
                      <Form.Group>
                        <h5 style={{ textAlign: 'center' }}>Custom Fields</h5>
                        <Button
                          className="float-end"
                          variant="outline-success"
                          onClick={() => showCreateFieldModal()}
                        >
                          <FiPlusCircle className="button-icon" /> Add
                        </Button>
                      </Form.Group>
                      <Form.Group style={{ marginTop: 63 }}>
                        {fields.map((field, key) => (
                          <Form.Group key={field.shortcode} className="mt-3">
                            <Form.Label>
                              <b>{field.shortcode}</b>
                            </Form.Label>

                            <Row
                              className="float-end"
                              style={{ marginTop: '10px', marginBottom: '10px' }}
                            >
                              <Col>
                                <span
                                  className={style.editButton}
                                  onClick={() => showEditFieldModal(field)}
                                >
                                  <FiEdit size={25} />
                                </span>
                              </Col>
                              <Col>
                                <span
                                  className={style.addButton}
                                  onClick={() => insertField(field.shortcode)}
                                >
                                  <FiCopy size={25} />
                                </span>
                              </Col>
                              <Col>
                                <span
                                  className={style.closeButton}
                                  onClick={() => removeField(fields, key, 'customField')}
                                >
                                  <FiXCircle size={25} />
                                </span>
                              </Col>
                            </Row>

                            <AutoResizableTextArea
                              value={field?.value}
                              onChange={(e) => setFieldValue(key, e.target.value)}
                              placeholder="Enter value"
                              required
                              isInvalid={errors.value}
                            />
                            <Form.Control.Feedback type="invalid">
                              You should provide value for field
                            </Form.Control.Feedback>
                          </Form.Group>
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <FormGroup className="float-end" style={{ display: 'flex', gap: '10px' }}>
                <Button
                  type="submit"
                  variant="outline-success"
                  className="mt-3"
                  disabled={isScriptSaving}
                >
                  <JournalText /> {isEditing ? 'Save' : 'Save as Draft'}
                </Button>

                <OverlayTrigger
                  placement="right"
                  overlay={
                    !errors.value && isFormValid(requiredForTryFields) ? (
                      <></>
                    ) : (
                      <Tooltip className="overlay-tooltip">
                        You should provide script and valid fields to move to the next step
                      </Tooltip>
                    )
                  }
                >
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() =>
                      isFormValid(requiredForNextStep) &&
                      isFieldsValid() &&
                      handleMoveBetweenSteps(1)
                    }
                  >
                    <ChevronDoubleRight /> Next Step
                  </Button>
                </OverlayTrigger>
              </FormGroup>
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
              <FormGroup className="float-end" style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => handleMoveBetweenSteps(-1)}
                >
                  <ChevronDoubleLeft /> Previous Step
                </Button>

                <OverlayTrigger
                  placement="right"
                  overlay={
                    !errors.value && isFormValid(requiredForSaveFields) ? (
                      <></>
                    ) : (
                      <Tooltip className="overlay-tooltip">
                        You should provide all fields except 'source' to save this script
                      </Tooltip>
                    )
                  }
                >
                  <Button
                    type="submit"
                    variant="outline-success"
                    className="mt-3"
                    disabled={isScriptSaving}
                  >
                    <Save /> Save
                  </Button>
                </OverlayTrigger>
              </FormGroup>
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
