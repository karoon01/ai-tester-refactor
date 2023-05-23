import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import style from '../index.module.css'
import AutoResizableTextArea from '../../AutoResizableTextArea'

const FieldsList = ({ fields, onChange, title, isRunning }) => {
  return (
    fields.length > 0 && (
      <>
        {title && <Form.Label className={style.label}>{title}</Form.Label>}
        {fields.map((field, key) => (
          <Form.Group key={field._id} className="mb-3">
            <Form.Label style={{ float: 'left' }}>{`{${field.shortcode}}`}</Form.Label>
            <AutoResizableTextArea
              onChange={(e) => onChange(key, e.target.value)}
              value={field?.value || ''}
              rows={1}
              required
              disabled={isRunning}
            />
          </Form.Group>
        ))}
      </>
    )
  )
}

FieldsList.propTypes = {
  fields: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
}

export default FieldsList
