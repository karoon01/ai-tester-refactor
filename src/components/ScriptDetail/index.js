import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FiCheckCircle, FiFeather } from 'react-icons/fi'
import { addScriptToUser, runScript, tryScript } from '../../services/user/scriptsService'
import { useOnLeavePageLoaderHide } from '../../hooks/handleUserLeaveOnRunning'
import { LOCAL_STORAGE } from '../../utils/constants'
import { getNotFilledFieldsMessage } from '../../utils/utils'
import ApiKeyModal from '../ApiKeyModal'
import FieldsList from './components/FieldsList'
import Quote from './components/Quote'
import style from './index.module.css'
import Highlight from './components/Highlight'

function ScriptDetail({
  script,
  toast,
  token,
  infoFields,
  customFields,
  setCustomFields,
  showLoader,
  showAuthModal,
  hideLoader,
}) {
  const [validated, setValidated] = useState(false)
  const [result, setResult] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [modal, setModal] = useState(false)
  const [toastId, setToastId] = useState()

  const router = useRouter()

  const submitRef = useRef(null)

  useOnLeavePageLoaderHide(toastId, setToastId)

  const refreshPage = () => router.reload(window.location.pathname)

  const installScript = async () => {
    if (token) {
      await toast.promise(addScriptToUser(script.script._id), {
        loading: 'Installing Script...',
        success: () => 'Script installed successfully!',
        error: (err) => `Something went wrong!\n${err}`,
      })

      refreshPage()
    } else {
      toast.error('Authorize first to install scripts')
      showAuthModal(refreshPage)
    }
  }

  const showApiKeyModal = () => {
    setModal(
      <ApiKeyModal
        setModal={setModal}
        showLoader={showLoader}
        hideLoader={hideLoader}
        afterSubmit={() => {
          submitRef.current.click()
        }}
      />
    )
  }

  const handleSubmit = async (event) => {
    if (!isRunning) {
      event.preventDefault()
      setValidated(true)
      const form = event.currentTarget

      if (form.checkValidity() === false) {
        return event.stopPropagation()
      }
      setIsRunning(true)
      const executeScript = async (values) => {
        const notFilledFieldsMessage = getNotFilledFieldsMessage(values, true)

        if (notFilledFieldsMessage) {
          throw new Error(notFilledFieldsMessage)
        }

        if (script.isInstalled) {
          await runScript(script.script._id, values, setResult, showApiKeyModal)
        } else {
          await tryScript(script.script.value, values, setResult, showApiKeyModal)
        }
      }

      const loadingToastId = toast.loading('Script is running...')
      setToastId(loadingToastId)
      await executeScript([...customFields, ...infoFields])
        .then(() => toast.success('Script executed successfully!'))
        .catch((err) => toast.error(`Something went wrong!\n${err}`))
        .finally(() => {
          setValidated(false)
          setIsRunning(false)
          toast.dismiss(loadingToastId)
          setToastId()
        })
    }
  }

  const handleChangeCustomField = (key, value) => {
    const fields = [...customFields]

    fields[key]['value'] = value

    setCustomFields(fields)
  }

  const saveProjectDataForAuth = () => {
    localStorage.setItem(
      `${LOCAL_STORAGE.SCRIPT_TRY_DATA}-${script.script._id}`,
      JSON.stringify({
        infoFields,
        customFields,
      })
    )

    refreshPage()
  }

  const exampleParamsStr = script?.scriptExample?.exampleFields
    .map((f) => `{${f.shortcode}}: ${f.value || '_'}`)
    .join(', \n')

  return (
    <>
      {modal}
      <Row>
        <Col md={6}>
          {script?.script?.category?.name}
          <h2 style={{ fontWeight: 100 }}>{script?.script?.title}</h2>
        </Col>
        <Col md={6}>
          <p style={{ fontSize: 18, textAlign: 'justify' }}>{script?.script?.description}</p>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <Form.Label>Prompt example</Form.Label>
          <Quote text={script?.scriptExample?.exampleOutput} />
          <br />
          <Form.Group className={style.buttons}>
            <Button
              ref={submitRef}
              disabled={isRunning}
              form="run-script-form"
              type={token ? 'submit' : 'button'}
              variant="primary"
              className={style.try}
              onClick={() => {
                if (!token) {
                  toast.error('Authorize first to try scripts')
                  showAuthModal(saveProjectDataForAuth)
                }
              }}
            >
              <FiFeather style={{ margin: 'auto' }} /> Compose
            </Button>
            <Button
              disabled={script.isInstalled}
              variant={script.installed ? 'success' : 'outline-success'}
              className={style.install}
              onClick={installScript}
            >
              <FiCheckCircle style={{ margin: 'auto' }} />{' '}
              {script.isInstalled ? 'Installed' : 'Install'}
            </Button>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Prompt</Form.Label>
            <Highlight text={`"${script?.script?.value}"`} />
            <Form.Control
              className={style.nonResize}
              style={{ whiteSpace: 'pre-line' }}
              disabled
              as="textarea"
              rows={4}
              value={exampleParamsStr}
            />
          </Form.Group>
        </Col>
      </Row>
      <br />
      <>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id="run-script-form">
          <Row>
            <Col md={6}>
              <FieldsList
                fields={script.isInstalled ? customFields : [...customFields, ...infoFields]}
                onChange={handleChangeCustomField}
                isRunning={isRunning}
                title="Prompt variables"
                isFullWidth
              />
            </Col>
            <Col md={6}>
              {result && (
                <Form.Group>
                  <Form.Label className={style.label}>Result</Form.Label>
                  <Quote text={result} />
                </Form.Group>
              )}
            </Col>
          </Row>
        </Form>
      </>
    </>
  )
}

ScriptDetail.propTypes = {
  script: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    author: PropTypes.string,
    type: PropTypes.string,
    likes: PropTypes.number,
    description: PropTypes.string,
    installs: PropTypes.number,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  toast: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  infoFields: PropTypes.array,
  customFields: PropTypes.array,
  setCustomFields: PropTypes.func.isRequired,
  showLoader: PropTypes.func.isRequired,
  hideLoader: PropTypes.func.isRequired,
}

export default ScriptDetail
