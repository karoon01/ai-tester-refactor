import axios from '../common/httpCommon'

export const toggleLikeScript = async (scriptId) => {
  return await axios.post('/like', { scriptId })
}

export const getAllLikedScripts = async (setResult) => {
  return await axios.get('/like').then(({ data }) => setResult(data.likesScripts))
}
