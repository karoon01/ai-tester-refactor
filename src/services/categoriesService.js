import axios from './common/httpCommon'

export const getCategoriesTree = async (setResult) => {
  return await axios.get('/script/category/all').then(({ data }) => setResult(data))
}

export const getAllDeepNestedCategories = async (setResult) => {
  return await axios
    .get('/script/category/all/nested')
    .then(({ data }) => setResult(data))
    .catch((err) => console.log(err))
}

export const getCategoryDetails = async (slug, setResult) => {
  return await axios.get(`/script/category/${slug}/details`).then(({ data }) => {
    setResult(data)
  })
}

export const getSubCategories = async (slug, setResult) => {
  return await axios.get(`/script/category/${slug}`).then(({ data }) => setResult(data))
}
