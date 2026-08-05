import api from './api'

const getProducts = async (params) => {
  const { data } = await api.get('/products', { params })
  return data
}

const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData)
  return data
}

const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData)
  return data
}

const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
