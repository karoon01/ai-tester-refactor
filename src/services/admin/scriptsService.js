import axios from '../common/adminHttpCommon'

export const getAllScripts = async (page, size, isVerified, setResult, setTotalLength) => {
  const type = isVerified ? 'verified' : 'users'

  return await axios.get(`/admin/script/all/${type}?page=${page}&size=${size}`).then(({ data }) => {
    setResult(data.scripts)
    setTotalLength(data.scriptsAmount)
  })
}

export const getScriptById = async (scriptId, setResult) => {
  return await axios.get(`/script/${scriptId}`).then(({ data }) => {
    setResult(data)
  })
}

export const saveScript = async (scriptData, isValid) => {
  return await axios
    .post(`/admin/script?${isValid ? 'to_publish=true' : ''}`, scriptData)
    .then(({ data }) => data)
}

export const editScript = async (data, isValid, scriptId) => {
  return await axios.put(`/script/${scriptId}?${isValid ? 'to_publish=true' : ''}`, data)
}

export const tryScript = async (value, fields, setResult, showApiKeyModal) => {
  return await axios
    .post('chat/try', { value, fields })
    .then(({ data }) => setResult(data.response))
    .catch(({ response }) => {
      const error = response?.data?.error

      if (error?.name === 'ApiError' && error?.status === 401) {
        showApiKeyModal()
        throw new Error('Enter your OpenAI API KEY')
      } else {
        throw new Error(error?.message)
      }
    })
}

export const changeScriptType = async (scriptId, currentType) => {
  const action = currentType === 'Public' ? 'unpublish' : 'publish'

  return await axios.put(`/admin/script/${action}/${scriptId}`)
}

export const getUserInfoFields = async (scriptId) => {
  return await axios.get(`/script/user-fields/${scriptId}`)
}

export const getScriptExample = async (scriptId) => {
  return await axios.get(`/script/${scriptId}/example`)
}

export const removeScript = async (scriptId) => {
  return await axios.delete(`/script/${scriptId}`)
}

export const getAllUserInfoFields = async (setResult) => {
  return axios.get('/script/fields/all').then(({ data }) => {
    setResult(data)
  })
}
