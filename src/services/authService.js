import axios from './common/httpCommon'

export const auth = (url) => async (formData, setResult) => {
  return await axios
    .post(url, formData)
    .then(({ data }) => setResult(data))
    .catch((error) => {
      throw new Error(error?.response?.data?.error?.message)
    })
}

export const login = auth('/auth/login')
export const register = auth('/auth/register')

export const verify = async (userId, code) => {
  return await axios.get(`/auth/verify/${userId}/${code}`)
}

export const verifyToken = async (token) => {
  const data = await axios.get(`/auth/token-verify/${token}`)
  return data
}

export const googleAuth = async (token, setResult) => {
  return await axios
    .post('/auth/google-auth', { token })
    .then(({ data }) => setResult(data))
    .catch((error) => {
      throw new Error(error?.response?.data?.error?.message)
    })
}
export const verifyPhone = async (userId, code) => {
  return await axios.get(`/auth/verify/${userId}/phone/${code}`)
}

export const sendPhoneVerificationCode = async (userId, data) => {
  return await axios.post(`/auth/verify/${userId}`, data)
}
