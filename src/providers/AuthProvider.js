import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { decode } from 'jsonwebtoken'
import Layout from '../components/Layout'
import { verifyToken } from '../services/authService'
import { LOCAL_STORAGE, USER_STATUS } from '../utils/constants'
import useFullPageLoader from '../hooks/useFullPageLoader'

const AuthProvider = ({ Component }) => {
  const [token, setToken] = useState('')
  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const router = useRouter()

  useEffect(() => {
    const getToken = async () => {
      showLoader()
      const storageToken = localStorage.getItem(LOCAL_STORAGE.TOKEN)

      if (!storageToken && Component.isOnlyUser) await router.push('/auth')

      if (storageToken) {
        await verifyToken(storageToken)
          .then(({ data }) => {
            const userData = decode(data.token)

            if (userData.status === USER_STATUS.BLOCKED) {
              localStorage.removeItem(LOCAL_STORAGE.TOKEN)
              router.push('/auth')
            } else {
              localStorage.setItem(LOCAL_STORAGE.TOKEN, data.token)
              setToken(data.token)
            }
          })
          .catch(() => {
            localStorage.removeItem(LOCAL_STORAGE.TOKEN)
            router.push('/auth')
          })
      }

      hideLoader()
    }
    if (!token) getToken()
  }, [])

  return <Layout token={token} setToken={setToken} loader={loader} Component={Component} />
}

export default AuthProvider
