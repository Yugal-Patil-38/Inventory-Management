import api from './api'

const adjustStock = async (productId, stockData) => {
  const { data } = await api.post(`/inventory/${productId}`, stockData)
  return data
}

const getActivity = async (params) => {
  const { data } = await api.get('/inventory', { params })
  return data
}

const getHistory = async (productId) => {
  const { data } = await api.get(`/inventory/${productId}`)
  return data
}

export default { adjustStock, getActivity, getHistory }
