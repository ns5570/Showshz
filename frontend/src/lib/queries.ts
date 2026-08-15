import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import type { City, MovieDetail, MovieSummary, SearchResult, Show } from '../types'

export interface Me {
  id: number
  clerkUserId: string
  email: string | null
  name: string | null
  isAdmin: boolean
}

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get<Me>('/me')).data,
    enabled,
    retry: false,
  })
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => (await api.get<City[]>('/public/cities')).data,
  })
}

export function useMovies(cityId: number | null) {
  return useQuery({
    queryKey: ['movies', cityId],
    queryFn: async () => (await api.get<MovieSummary[]>('/public/movies', { params: { cityId } })).data,
    enabled: cityId !== null,
  })
}

export function useMovie(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => (await api.get<MovieDetail>(`/public/movies/${movieId}`)).data,
  })
}

export function useShows(movieId: number, cityId: number | null, date: string) {
  return useQuery({
    queryKey: ['shows', movieId, cityId, date],
    queryFn: async () =>
      (await api.get<Show[]>(`/public/movies/${movieId}/shows`, { params: { cityId, date } })).data,
    enabled: cityId !== null,
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => (await api.get<SearchResult>('/public/search', { params: { q: query } })).data,
    enabled: query.trim().length > 1,
  })
}
