import axios from '../common/adminHttpCommon'

export const getAllUserInfoFieldsForUserScripts = async (setResult) => {
  return await axios.get('/script/fields/all').then(({ data }) => {
    setResult(data)
  })
}

export const createUserInfoField = async (data) => {
  return await axios.post('/script/user-fields/', data)
}

export const editUserInfoField = async (fieldId, data) => {
  return await axios.put(`/script/user-fields/${fieldId}`, data)
}

export const removeUserInfoField = async (fieldId) => {
  return await axios.delete(`/script/user-fields/${fieldId}`)
}
