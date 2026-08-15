import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'
import type {
  AdminEventShow,
  AdminScreen,
  AdminShow,
  AdminVenue,
  EventDetail,
  EventRequest,
  EventShowRequest,
  MovieDetail,
  MovieRequest,
  MovieWithShowsRequest,
  MovieWithShowsResponse,
  Page,
  ScreenRequest,
  ShowRequest,
  VenueRequest,
} from '../types'

export function useAdminMovies(page: number) {
  return useQuery({
    queryKey: ['admin', 'movies', page],
    queryFn: async () => (await api.get<Page<MovieDetail>>('/admin/movies', { params: { page } })).data,
  })
}

export function useAllAdminMovies() {
  return useQuery({
    queryKey: ['admin', 'movies', 'all'],
    queryFn: async () => (await api.get<MovieDetail[]>('/admin/movies/all')).data,
  })
}

export function useCreateMovie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: MovieRequest) => (await api.post<MovieDetail>('/admin/movies', request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] }),
  })
}

export function useCreateMovieWithShows() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: MovieWithShowsRequest) =>
      (await api.post<MovieWithShowsResponse>('/admin/movies/with-shows', request)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'shows'] })
    },
  })
}

export function useUpdateMovie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: MovieRequest }) =>
      (await api.put<MovieDetail>(`/admin/movies/${id}`, request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] }),
  })
}

export function useDeleteMovie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/movies/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] }),
  })
}

export function useAdminVenues(page: number) {
  return useQuery({
    queryKey: ['admin', 'venues', page],
    queryFn: async () => (await api.get<Page<AdminVenue>>('/admin/venues', { params: { page } })).data,
  })
}

export function useAllAdminVenues() {
  return useQuery({
    queryKey: ['admin', 'venues', 'all'],
    queryFn: async () => (await api.get<Page<AdminVenue>>('/admin/venues', { params: { size: 200 } })).data.content,
  })
}

export function useCreateVenue() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: VenueRequest) => (await api.post<AdminVenue>('/admin/venues', request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'venues'] }),
  })
}

export function useAdminScreens(venueId: number | null) {
  return useQuery({
    queryKey: ['admin', 'venues', venueId, 'screens'],
    queryFn: async () => (await api.get<AdminScreen[]>(`/admin/venues/${venueId}/screens`)).data,
    enabled: venueId !== null,
  })
}

export function useCreateScreen(venueId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: ScreenRequest) =>
      (await api.post<AdminScreen>(`/admin/venues/${venueId}/screens`, request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'venues', venueId, 'screens'] }),
  })
}

export function useAdminShows(page: number) {
  return useQuery({
    queryKey: ['admin', 'shows', page],
    queryFn: async () => (await api.get<Page<AdminShow>>('/admin/shows', { params: { page } })).data,
  })
}

export function useCreateShow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: ShowRequest) => (await api.post<AdminShow>('/admin/shows', request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'shows'] }),
  })
}

export function useAdminEvents(page: number) {
  return useQuery({
    queryKey: ['admin', 'events', page],
    queryFn: async () => (await api.get<Page<EventDetail>>('/admin/events', { params: { page } })).data,
  })
}

export function useAllAdminEvents() {
  return useQuery({
    queryKey: ['admin', 'events', 'all'],
    queryFn: async () => (await api.get<Page<EventDetail>>('/admin/events', { params: { size: 200 } })).data.content,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: EventRequest) => (await api.post<EventDetail>('/admin/events', request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, request }: { id: number; request: EventRequest }) =>
      (await api.put<EventDetail>(`/admin/events/${id}`, request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/admin/events/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'events'] }),
  })
}

export function useAdminEventShows(page: number) {
  return useQuery({
    queryKey: ['admin', 'event-shows', page],
    queryFn: async () => (await api.get<Page<AdminEventShow>>('/admin/event-shows', { params: { page } })).data,
  })
}

export function useCreateEventShow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: EventShowRequest) =>
      (await api.post<AdminEventShow>('/admin/event-shows', request)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'event-shows'] }),
  })
}
