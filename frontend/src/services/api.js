import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('jobportal-auth')
  const auth = raw ? JSON.parse(raw) : null
  if (auth?.token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export default api
