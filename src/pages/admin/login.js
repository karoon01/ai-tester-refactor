import PropTypes from 'prop-types'

import AuthForm from '../../components/Admin/AuthForm'

const Auth = ({ setToken }) => {
  return <AuthForm setToken={setToken} />
}

Auth.title = 'Authorization'
Auth.isNotLoggedIn = true

Auth.propTypes = {
  setToken: PropTypes.func.isRequired,
}

export default Auth
