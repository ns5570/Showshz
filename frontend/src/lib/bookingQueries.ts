import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { BookingResponse, FeedbackRequest, HoldRequest, HoldResponse, ShowSeatMap } from '../types'

export function useSeatMap(showId: number, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['seat-map', showId],
    queryFn: async () => (await api.get<ShowSeatMap>(`/public/shows/${showId}/seat-map`)).data,
    refetchInterval: options?.refetchInterval,
  })
}

export function useCreateHold() {
  return useMutation({
    mutationFn: async (request: HoldRequest) => (await api.post<HoldResponse>('/bookings/hold', request)).data,
  })
}

export function useConfirmBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (holdId: string) =>
      (await api.post<BookingResponse>('/bookings/confirm', { holdId })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  })
}

export function useMyBookings(enabled: boolean) {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => (await api.get<BookingResponse[]>('/bookings')).data,
    enabled,
  })
}

export function useBookingByReference(reference: string | undefined) {
  return useQuery({
    queryKey: ['bookings', reference],
    queryFn: async () => (await api.get<BookingResponse>(`/bookings/${reference}`)).data,
    enabled: Boolean(reference),
  })
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, request }: { bookingId: number; request: FeedbackRequest }) =>
      (await api.post<BookingResponse>(`/bookings/${bookingId}/feedback`, request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  })
}
