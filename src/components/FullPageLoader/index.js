import React from 'react'
import style from './index.module.css'

const FullPageLoader = () => {
  return (
    <div className={style.container}>
      <div className={style.loader}>
        <div className={style.spinner} />
      </div>
    </div>
  )
}

export default FullPageLoader
