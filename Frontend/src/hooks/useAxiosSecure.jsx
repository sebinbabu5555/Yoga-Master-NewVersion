import { useContext, useEffect } from "react"
import { AuthContext } from "../ultilities/providers/AuthProvider"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "../config/api"

const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
})

const useAxiosSecure = () => {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Add a request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add a response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Only redirect to /login on 401 if we are NOT already on a public page
        const publicPaths = ['/login', '/register', '/onboarding']
        const isPublicPage = publicPaths.some((p) => window.location.pathname.startsWith(p))
        if (error.response && error.response.status === 401 && !isPublicPage) {
          try {
            if (typeof logout === 'function') {
              await logout()
            }
          } catch (e) {
            console.error('Logout error:', e)
          }
          localStorage.removeItem('token')
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor)
      axiosSecure.interceptors.response.eject(responseInterceptor)
    }
  }, [logout, navigate])

  return axiosSecure
}

export default useAxiosSecure