import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getLastCategoryScripts, getScriptDetails } from '../../services/scriptsService'
import ScriptDetail from '../../components/ScriptDetail'
import useFullPageLoader from '../../hooks/useFullPageLoader'
import ScriptsList from '../../components/ScriptsList'
import { LOCAL_STORAGE } from '../../utils/constants'

function Script({ toast, token, showAuthModal }) {
  const [script, setScript] = useState()
  const [scripts, setScripts] = useState()
  const [notFound, setNotFound] = useState(false)
  const [customFields, setCustomFields] = useState([])
  const [infoFields, setInfoFields] = useState([])

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()
  const { slug } = router.query

  const setScriptData = (data) => {
    setScript(data)

    const categoryId = data?.script?.category?._id
    const scriptId = data?.script?._id

    const scriptData = JSON.parse(
      localStorage.getItem(`${LOCAL_STORAGE.SCRIPT_TRY_DATA}-${scriptId}`)
    )

    if (scriptData) {
      setCustomFields(scriptData.customFields)

      localStorage.removeItem(`${LOCAL_STORAGE.SCRIPT_TRY_DATA}-${scriptId}`)
    } else {
      setCustomFields(data.customFields)
    }

    setInfoFields(data.infoFields)
    getLastCategoryScripts(categoryId, setScripts, scriptId).catch(() => setNotFound(true))
  }

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setScripts()

      await getScriptDetails(slug, setScriptData).catch(() => setNotFound(true))
      hideLoader()
    }

    if (router.isReady) fetchData()
  }, [router.isReady, slug])

  if (notFound) {
    return (
      <section>
        <h1>Script not found</h1>
        <p>We can't find script with such page. Maybe you were looking for something else</p>
      </section>
    )
  }

  if (script && scripts)
    return (
      <>
        {loader}
        <Container className={loader ? 'blur' : ''}>
          <ScriptDetail
            script={script}
            showAuthModal={showAuthModal}
            toast={toast}
            token={token}
            showLoader={showLoader}
            hideLoader={hideLoader}
            infoFields={infoFields}
            customFields={customFields}
            setCustomFields={setCustomFields}
          />
          {scripts.scripts.length > 0 && (
            <ScriptsList
              scripts={scripts.scripts}
              title={<h3>Other {script?.script?.category?.name} scripts</h3>}
              categoryName={script?.script?.category?.name}
              toast={toast}
              showAuthModal={showAuthModal}
              token={token}
              moreUrl={`/category/${script?.script?.category?.slug}`}
            />
          )}
        </Container>
      </>
    )

  return loader
}

Script.propTypes = {
  toast: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  showAuthModal: PropTypes.func.isRequired,
}

export default Script
