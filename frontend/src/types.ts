export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface City {
  id: number
  name: string
  state: string
  slug: string
  latitude: number | null
  longitude: number | null
}

export interface MovieSummary {
  id: number
  title: string
  slug: string
  posterUrl: string | null
  languages: string[]
  genres: string[]
  durationMinutes: number
  censorRating: string | null
}

export interface MovieDetail extends MovieSummary {
  description: string | null
  trailerUrl: string | null
  releaseDate: string
}

export interface Show {
  id: number
  venueId: number
  venueName: string
  screenId: number
  screenName: string
  startTime: string
  endTime: string
  basePrice: number
}

export interface MovieRequest {
  title: string
  slug: string
  description: string | null
  durationMinutes: number
  languages: string[]
  genres: string[]
  releaseDate: string
  posterUrl: string | null
  censorRating: string | null
  trailerUrl: string | null
}

export interface MovieWithShowsRequest {
  movie: MovieRequest
  screenIds: number[]
  startTimes: string[]
  basePrice: number
}

export interface MovieWithShowsResponse {
  movie: MovieDetail
  shows: AdminShow[]
}

export interface AdminVenue {
  id: number
  name: string
  address: string
  slug: string
  cityId: number
  cityName: string
}

export interface VenueRequest {
  cityId: number
  name: string
  address: string
  slug: string
}

export interface AdminScreen {
  id: number
  name: string
  venueId: number
  seatCount: number
}

export interface ScreenRequest {
  name: string
}

export interface AdminShow {
  id: number
  movieId: number
  movieTitle: string
  screenId: number
  screenName: string
  venueId: number
  venueName: string
  startTime: string
  endTime: string
  basePrice: number
}

export interface ShowRequest {
  movieId: number
  screenId: number
  startTime: string
  basePrice: number
}

export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED'
export type SeatType = 'REGULAR' | 'PREMIUM' | 'RECLINER'

export interface SeatMapEntry {
  showSeatId: number
  rowLabel: string
  seatNumber: number
  seatType: SeatType
  price: number
  status: SeatStatus
}

export interface ShowSeatMap {
  showId: number
  movieTitle: string
  venueName: string
  screenName: string
  startTime: string
  seats: SeatMapEntry[]
}

export interface HoldRequest {
  showId: number
  showSeatIds: number[]
}

export interface HoldResponse {
  holdId: string
  expiresAt: string
  totalAmount: number
  seatCount: number
}

export interface BookingSeatSummary {
  rowLabel: string
  seatNumber: number
  seatType: SeatType
  price: number
}

export interface FeedbackSummary {
  rating: number
  comment: string | null
}

export interface FeedbackRequest {
  rating: number
  comment: string | null
}

export interface BookingResponse {
  id: number
  bookingReference: string
  status: string
  movieTitle: string
  venueName: string
  screenName: string
  startTime: string
  totalAmount: number
  seats: BookingSeatSummary[]
  createdAt: string
  feedback: FeedbackSummary | null
}

export interface EventSummary {
  id: number
  title: string
  slug: string
  category: string
  imageUrl: string | null
}

export interface EventDetail extends EventSummary {
  description: string | null
  durationMinutes: number | null
}

export interface EventShow {
  id: number
  venueId: number
  venueName: string
  screenId: number
  screenName: string
  startTime: string
  endTime: string
  basePrice: number
}

export interface EventRequest {
  title: string
  slug: string
  category: string
  description: string | null
  imageUrl: string | null
  durationMinutes: number | null
}

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  imageUrl: string | null
  publishedAt: string
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string
}

export interface AdminEventShow {
  id: number
  eventId: number
  eventTitle: string
  screenId: number
  screenName: string
  venueId: number
  venueName: string
  startTime: string
  endTime: string
  basePrice: number
}

export interface EventShowRequest {
  eventId: number
  screenId: number
  startTime: string
  basePrice: number
}

export interface EventShowSeatMap {
  eventShowId: number
  eventTitle: string
  venueName: string
  screenName: string
  startTime: string
  seats: { eventShowSeatId: number; rowLabel: string; seatNumber: number; seatType: SeatType; price: number; status: SeatStatus }[]
}

export interface EventBookingResponse {
  id: number
  bookingReference: string
  status: string
  eventTitle: string
  venueName: string
  screenName: string
  startTime: string
  totalAmount: number
  seats: BookingSeatSummary[]
  createdAt: string
  feedback: FeedbackSummary | null
}

export interface SearchResult {
  movies: MovieSummary[]
  venues: { id: number; name: string; cityName: string; cityId: number }[]
}
