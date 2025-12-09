import axios from "axios"

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "http://localhost:8070/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("role")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default apiClient


