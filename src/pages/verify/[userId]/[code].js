import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import FullPageLoader from '../../../components/FullPageLoader'

import { verify } from '../../../services/authService'

function VerifyPage({ toast }) {
  const router = useRouter()
  const { userId, code } = router.query

  useEffect(() => {
    if (userId && code) {
      verify(userId, code)
        .then(() => {
          toast.success('User successfully verified! Now you may log in.')
          router.push('/auth')
        })
        .catch(() => {
          toast.error('User was not found or the code expired.')
          router.push('/')
        })
    }
  }, [userId, code, router])

  return <FullPageLoader />
}

export default VerifyPage
