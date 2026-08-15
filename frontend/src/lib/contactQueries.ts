import { useMutation } from '@tanstack/react-query'
import { api } from './api'

export interface ContactRequest {
  name: string
  email: string
  message: string
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (request: ContactRequest) => {
      await api.post('/public/contact', request)
    },
  })
}
