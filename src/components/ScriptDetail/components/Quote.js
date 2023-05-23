import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import style from './quote.module.css'

const Quote = ({ text = '' }) => {
  const textTooLong = text.length > 500
  const [showMore, setShowMore] = useState(textTooLong)

  const textToShow = showMore ? `${text.substring(0, 500)}...` : text
  return (
    <div className={style.container}>
      <span className={style.prompt}>{textToShow}</span>
      {textTooLong && (
        <Button variant="outline-success" onClick={() => setShowMore(!showMore)}>
          {showMore ? 'Show more' : 'Minimize'}
        </Button>
      )}
    </div>
  )
}

export default Quote
