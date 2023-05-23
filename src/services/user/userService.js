import axios from '../common/httpCommon'

export const getStatus = async (userId) => {
  return await axios.get(`/user/status/${userId}`)
}

export const getUserById = async (userId) => {
  return await axios.get(`/user/${userId}`)
}

export const getUserProfile = async (setResult) => {
  return await axios.get('/user/profile').then(({ data }) => setResult(data))
}

export const saveOpenAiApikey = async (apikey) => {
  return await axios.put('/user/save/apikey', apikey).catch((error) => {
    throw new Error(error?.response?.data?.error?.message)
  })
}
