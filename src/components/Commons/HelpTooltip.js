import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Question } from 'react-bootstrap-icons'

function HelpTooltip({ tooltipText }) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip className="overlay-tooltip">{tooltipText}</Tooltip>}
      trigger={['hover', 'focus']}
    >
      <Question style={{ position: 'absolute' }} />
    </OverlayTrigger>
  )
}

export default HelpTooltip
