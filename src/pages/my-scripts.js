import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { decode } from 'jsonwebtoken'
import { Button, Container } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { FiPlusCircle } from 'react-icons/fi'

import useFullPageLoader from '../hooks/useFullPageLoader'
import { getAllUserScripts } from '../services/user/scriptsService'
import { getAllLikedScripts } from '../services/user/likesService'
import ScriptsList from '../components/ScriptsList'
import NoScriptsMessage from '../components/NoScriptsMessage'
import style from './my-scripts.module.css'

function UserScripts({ token, toast, showAuthModal }) {
  const [loader, showLoader, hideLoader] = useFullPageLoader()
  const [userScripts, setUserScripts] = useState([])
  const [likedScripts, setLikedScripts] = useState([])
  const [user, setUser] = useState()
  const [isScriptsUpdated, setScriptsUpdated] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      setScriptsUpdated(false)
      setUser(decode(token))
      await getAllUserScripts(setUserScripts)
      await getAllLikedScripts(setLikedScripts)
      hideLoader()
    }

    if (token) {
      fetchData()
    }
  }, [token, isScriptsUpdated])

  const scripts = userScripts.reduce(
    (acc, currentScript) => {
      currentScript.author === user.id
        ? acc.ownScripts.push(currentScript)
        : acc.installedScripts.push(currentScript)

      return acc
    },
    { ownScripts: [], installedScripts: [] }
  )

  return (
    <>
      {loader}
      <Container fluid="xxl" className={loader ? 'blur' : ''}>
        <div className={style.createScriptBlock}>
          <Button variant="outline-success" onClick={() => router.push('/scripts/create')}>
            <FiPlusCircle /> Create Script
          </Button>
        </div>
        {scripts.installedScripts.length > 0 && (
          <ScriptsList
            token={token}
            toast={toast}
            title={<h2>Installed Scripts</h2>}
            scripts={scripts.installedScripts}
            userId={user.id}
            showAuthModal={showAuthModal}
            canUninstall={true}
            setScriptsUpdated={setScriptsUpdated}
          />
        )}
        {scripts.ownScripts.length > 0 && (
          <ScriptsList
            token={token}
            toast={toast}
            title={<h2>Own Scripts</h2>}
            showAuthModal={showAuthModal}
            scripts={scripts.ownScripts}
            userId={user.id}
            canUninstall={true}
            setScriptsUpdated={setScriptsUpdated}
          />
        )}
        {likedScripts.length > 0 && (
          <ScriptsList
            token={token}
            toast={toast}
            showAuthModal={showAuthModal}
            title={<h2>Liked Scripts</h2>}
            scripts={likedScripts}
            userId={user.id}
            setScriptsUpdated={setScriptsUpdated}
          />
        )}

        {!loader && userScripts.length === 0 && likedScripts.length === 0 ? (
          <NoScriptsMessage />
        ) : null}
      </Container>
    </>
  )
}

UserScripts.title = 'User Scripts'
UserScripts.isOnlyUser = true

UserScripts.propTypes = {
  token: PropTypes.string.isRequired,
  toast: PropTypes.func.isRequired,
}

export default UserScripts
