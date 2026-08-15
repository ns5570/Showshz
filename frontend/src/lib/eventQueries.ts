import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import type { EventDetail, EventShow, EventSummary } from '../types'

export function useEvents(cityId: number | null, category?: string) {
  return useQuery({
    queryKey: ['events', cityId, category],
    queryFn: async () =>
      (await api.get<EventSummary[]>('/public/events', { params: { cityId, category } })).data,
    enabled: cityId !== null,
  })
}

export function useEvent(eventId: number) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => (await api.get<EventDetail>(`/public/events/${eventId}`)).data,
  })
}

export function useEventShows(eventId: number, cityId: number | null, date: string) {
  return useQuery({
    queryKey: ['event-shows', eventId, cityId, date],
    queryFn: async () =>
      (await api.get<EventShow[]>(`/public/events/${eventId}/shows`, { params: { cityId, date } })).data,
    enabled: cityId !== null,
  })
}
