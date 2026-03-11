import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

let isHandlingUnauth = false

export function clearAuthAndRedirect() {
  if (isHandlingUnauth) return
  isHandlingUnauth = true

  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('auth-storage')

  setTimeout(() => {
    isHandlingUnauth = false
    window.location.href = '/login'
  }, 100)
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isOnLoginPage = window.location.pathname === '/login'
      if (!isOnLoginPage) clearAuthAndRedirect()
    }
    return Promise.reject(error)
  },
)

export default apiClient
