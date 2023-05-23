import axios from '../common/adminHttpCommon'

export const getAllCategories = async (setAllCategories) => {
  return await axios.get('/admin/script/category/all').then(({ data }) => setAllCategories(data))
}

export const getAllCategoriesPaginated = async (page, size, setResult, setTotalLength) => {
  return await axios
    .get(`/admin/script/category/all/paginated?page=${page}&size=${size}`)
    .then(({ data }) => {
      setResult(data.categories)
      setTotalLength(data.categoriesAmount)
    })
}

export const createCategory = async (categoryBody) => {
  return await axios.post('/admin/script/category/', categoryBody)
}

export const updateCategory = async (categoryId, categoryBody) => {
  return await axios.put(`/admin/script/category/${categoryId}`, categoryBody)
}

export const removeCategory = async (categoryId) => {
  return await axios.delete(`/script/category/${categoryId}`)
}
