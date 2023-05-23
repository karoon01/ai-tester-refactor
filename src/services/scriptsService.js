import axios from './common/httpCommon'

export const searchScripts = async (formData, setResult, onError) => {
  return await axios
    .post('/script/search', formData)
    .then(({ data }) => setResult(data))
    .catch((error) => onError(error?.response?.data?.error?.message))
}

export const getTopInstalledScripts = async (setResult) => {
  return await axios.get('/script/top').then(({ data }) => setResult(data))
}

export const getScriptDetails = async (slug, setResult) => {
  return await axios.get(`/script/by-slug/${slug}/details`).then(({ data }) => setResult(data))
}

export const getLastCategoryScripts = async (
  categoryId,
  setResult,
  exceptScript = null,
  page = 1,
  size = 4
) => {
  return await axios
    .get(
      `/script/all/category/${categoryId}?except_script=${exceptScript}&page=${page}&size=${size}`
    )
    .then(({ data }) => setResult(data))
}

export const getAllScriptsFromNestedCategories = async (
  slug,
  setResult,
  setTotalLength,
  page = 1,
  size = 20
) => {
  return await axios
    .get(`/script/all/category/nested/${slug}?page=${page}&size=${size}`)
    .then(({ data }) => {
      setResult(data.scripts)
      setTotalLength(data.totalAmount)
    })
}
