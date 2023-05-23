import axios from '../common/adminHttpCommon'

export const login = async (values, setResult, onError) => {
  return await axios
    .post('/admin/auth/login', values)
    .then(({ data }) => setResult(data))
    .catch((error) => onError(error?.response?.data?.error?.message))
}
