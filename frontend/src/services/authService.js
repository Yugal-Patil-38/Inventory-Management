import api from './api'

const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData)
  return data
}

const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

export default { register, login, getCurrentUser }
