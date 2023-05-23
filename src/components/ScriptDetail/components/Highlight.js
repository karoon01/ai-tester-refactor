import React from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'

import style from './Highlight.module.css'

const Highlight = ({ text = '' }) => {
  const regex = new RegExp(/{([^}]*)}/g)
  const result = text.replace(regex, `<span class=${style.brackets}>{$1}</span>`)

  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(result),
  })

  return <div className={style.prompt} dangerouslySetInnerHTML={sanitizedData()} />
}

Highlight.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Highlight
