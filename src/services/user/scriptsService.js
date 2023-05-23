import axios from '../common/httpCommon'

export const createScript = async (scriptData, isValid) => {
  const toPublish = isValid ? 'to_publish=true' : ''
  return await axios.post(`/script?${toPublish}`, scriptData).then(({ data }) => data)
}

export const editScript = async (data, isValid, scriptId) => {
  const toPublish = isValid ? 'to_publish=true' : ''
  return await axios.put(`/script/${scriptId}?${toPublish}`, data)
}

export const removeScript = async (scriptId) => {
  return await axios.delete(`/script/${scriptId}`)
}

export const uninstallScript = async (scriptId) => {
  return await axios.delete(`/script/user/${scriptId}`)
}

export const getAllUserInfoFields = async (setResult) => {
  return axios.get('/script/fields/all').then(({ data }) => {
    setResult(data)
  })
}

export const getAllUserScripts = async (setResult) => {
  return axios.get('/script/user').then(({ data }) => setResult(data.scripts))
}

export const addScriptToUser = async (scriptId) => {
  return axios.post('/script/user', { scriptId }).catch((error) => {
    throw Error(error?.response?.data?.error?.message)
  })
}

export const executeScript =
  (url, paramName) => async (value, fields, setResult, showApiKeyModal) => {
    return await axios
      .post(url, { [paramName]: value, fields })
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

export const tryScript = executeScript('/chat/try', 'value')
export const runScript = executeScript('/chat', 'scriptId')

export const getScriptById = async (scriptId, setResult) => {
  return await axios.get(`/script/${scriptId}`).then(({ data }) => {
    setResult(data)
  })
}

export const getUserInfoFields = async (scriptId) => {
  return await axios.get(`/script/user-fields/${scriptId}`)
}

export const getScriptExample = async (scriptId) => {
  return await axios.get(`/script/${scriptId}/example`)
}
