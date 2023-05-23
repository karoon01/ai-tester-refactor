import React from 'react'
import { Stepper, Step } from 'react-form-stepper'
import { Check2 } from 'react-bootstrap-icons'

function CustomStepper({ currentStep, steps }) {
  return (
    <Stepper
      activeStep={currentStep}
      connectorStateColors
      connectorStyleConfig={{
        disabledColor: '#adadad',
        activeColor: '#0f893b',
        size: 2,
      }}
      styleConfig={{
        size: '40px',
        circleFontSize: '14',
        labelFontSize: '1.2rem',
        inactiveBgColor: '#adadad',
        activeBgColor: '#13ae4b',
        completedBgColor: '#0f893b',
      }}
    >
      {steps.map((step) => (
        <Step
          key={step.id}
          label={step.label}
          style={{ display: 'block' }}
          active={step.id === currentStep}
          completed={step.id < currentStep}
        >
          {step.id < currentStep && <Check2 />}
        </Step>
      ))}
    </Stepper>
  )
}

export default CustomStepper
