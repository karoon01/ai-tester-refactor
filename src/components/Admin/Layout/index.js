import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Page404 from '../../../pages/404'
import FullPageLoader from '../../FullPageLoader'

import Header from './Header'

function Layout({ loader, Component, token = '', setToken }) {
  let content

  if (loader) {
    content = <FullPageLoader />
  }
  if (token && Component.isNotLoggedIn) {
    content = <Page404 />
  } else {
    content = <Component token={token} setToken={setToken} loader={loader} />
  }

  return (
    <>
      <Toaster />
      <Head>
        <title>{Component.title || 'Admin Panel'}</title>
        <meta property="og:title" content={Component.title || 'Admin Panel'} key="title" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header setToken={setToken} token={token} />
      <main>{content}</main>
    </>
  )
}

export default Layout
