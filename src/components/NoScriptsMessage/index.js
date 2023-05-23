import React from 'react'
import { NavLink } from 'react-bootstrap'
import style from './index.module.css'

function NoScriptsMessage() {
  return (
    <section>
      <h1>You haven't installed any scripts yet. </h1>
      <NavLink className={style.link} href="/">
        You can review available scripts here
      </NavLink>
    </section>
  )
}

export default NoScriptsMessage
