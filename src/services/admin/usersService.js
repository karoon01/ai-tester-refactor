import axios from '../common/adminHttpCommon'

export const getAllUsersPaginated = async (
  currentPage,
  itemsPerPage,
  setResult,
  setTotalLength
) => {
  return await axios
    .get(`/admin/user/all?page=${currentPage}&size=${itemsPerPage}`)
    .then(({ data }) => {
      setResult(data.users)
      setTotalLength(data.totalAmount)
    })
}

export const blockUser = async (userId) => {
  return await axios.put(`/admin/user/block/${userId}`)
}

export const getUserById = async (userId, setResult) => {
  return await axios.get(`/admin/user/${userId}`).then(({ data }) => {
    setResult(data)
  })
}

export const changeUserSponsoring = async (userId) => {
  return await axios.put(`/admin/user/sponsoring/${userId}`)
}
