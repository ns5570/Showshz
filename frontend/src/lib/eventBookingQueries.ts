import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type { EventBookingResponse, EventShowSeatMap, FeedbackRequest, HoldRequest, HoldResponse } from '../types'

export function useEventSeatMap(eventShowId: number) {
  return useQuery({
    queryKey: ['event-seat-map', eventShowId],
    queryFn: async () => (await api.get<EventShowSeatMap>(`/public/event-shows/${eventShowId}/seat-map`)).data,
  })
}

export function useCreateEventHold() {
  return useMutation({
    mutationFn: async (request: HoldRequest) =>
      (await api.post<HoldResponse>('/event-bookings/hold', request)).data,
  })
}

export function useConfirmEventBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (holdId: string) =>
      (await api.post<EventBookingResponse>('/event-bookings/confirm', { holdId })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-bookings'] }),
  })
}

export function useMyEventBookings(enabled: boolean) {
  return useQuery({
    queryKey: ['event-bookings'],
    queryFn: async () => (await api.get<EventBookingResponse[]>('/event-bookings')).data,
    enabled,
  })
}

export function useSubmitEventFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, request }: { bookingId: number; request: FeedbackRequest }) =>
      (await api.post<EventBookingResponse>(`/event-bookings/${bookingId}/feedback`, request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-bookings'] }),
  })
}
