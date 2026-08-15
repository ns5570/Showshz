import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { api } from './api'

export function useAuthTokenInjector() {
  const { getToken } = useAuth()

  useEffect(() => {
    const interceptorId = api.interceptors.request.use(async (config) => {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    return () => api.interceptors.request.eject(interceptorId)
  }, [getToken])
}
