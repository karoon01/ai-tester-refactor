import { useState } from 'react'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast'
import { PROJECT_NAME } from '../../utils/constants'
import Page404 from '../../pages/404'
import FullPageLoader from '../FullPageLoader'
import AuthModal from '../Auth/AuthModal'
import Footer from './Footer'
import Header from './Header'

function Layout({ Component, token, setToken, loader }) {
  const [modal, setModal] = useState(false)

  const showAuthModal = (onLoginPageAction = null) => {
    setModal(
      <AuthModal
        toast={toast}
        setToken={setToken}
        setModal={setModal}
        onLoginPageAction={onLoginPageAction}
      />
    )
  }

  const content = loader ? (
    <FullPageLoader />
  ) : token && Component.isNotLoggedIn ? (
    <Page404 />
  ) : (
    <Component
      toast={toast}
      token={token}
      setToken={setToken}
      loader={loader}
      showAuthModal={showAuthModal}
    />
  )

  return (
    <>
      <Toaster />
      <Head>
        <title>{Component.title || PROJECT_NAME}</title>
        <meta property="og:title" content={Component.title || PROJECT_NAME} key="title" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header token={token} setToken={setToken} toast={toast} isOnlyUser={Component.isOnlyUser} />
      {modal}
      <main>{content}</main>
      <Footer />
    </>
  )
}

export default Layout
