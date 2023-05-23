import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { decode } from 'jsonwebtoken'
import Layout from '../components/Admin/Layout'
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
      const storageToken = localStorage.getItem(LOCAL_STORAGE.ADMIN_TOKEN)

      if (!storageToken && Component.isOnlyAdmin) return router.push('/admin/login')

      if (storageToken) {
        await verifyToken(storageToken)
          .then(({ data }) => {
            const userData = decode(data.token)

            if (userData.status === USER_STATUS.BLOCKED) {
              localStorage.removeItem(LOCAL_STORAGE.ADMIN_TOKEN)
              router.push('/auth')
            } else {
              localStorage.setItem(LOCAL_STORAGE.ADMIN_TOKEN, data.token)
              setToken(data.token)
            }
          })
          .catch(() => {
            localStorage.removeItem(LOCAL_STORAGE.ADMIN_TOKEN)
            router.push('/admin/login')
          })
      }
    }
    if (!token) getToken()

    hideLoader()
  }, [])

  return <Layout token={token} setToken={setToken} loader={loader} Component={Component} />
}

export default AuthProvider
