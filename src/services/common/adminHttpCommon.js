import axios from 'axios'
import { LOCAL_STORAGE } from '../../utils/constants'

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}`,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE.ADMIN_TOKEN)
  if (token) config.headers.authorization = `Bearer ${token}`
  return config
})

export default instance
