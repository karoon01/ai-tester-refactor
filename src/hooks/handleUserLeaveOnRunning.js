import Router from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export const useOnLeavePageLoaderHide = (toastId, setToastId) => {
  useEffect(() => {
    if (toastId) {
      const routeChangeStart = () => {
        toast.remove(toastId)
        setToastId()
      }

      Router.events.on('routeChangeStart', routeChangeStart)
      return () => {
        Router.events.off('routeChangeStart', routeChangeStart)
      }
    }
  }, [toastId])
}
