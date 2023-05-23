import React, { useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import style from './index.module.css'

const AutoResizableTextArea = ({ value, onChange, ...props }) => {
  const textAreaRef = useRef(null)

  const resizeTextArea = () => {
    textAreaRef.current.style.height = 'auto'
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'
  }

  useEffect(resizeTextArea, [value])

  return (
    <Form.Control
      as="textarea"
      ref={textAreaRef}
      className={style.resizable}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default AutoResizableTextArea
