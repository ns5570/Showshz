import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import EventSeatSelectionPage from './pages/EventSeatSelectionPage'
import BlogPostPage from './pages/BlogPostPage'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminMoviesPage from './pages/admin/AdminMoviesPage'
import AdminVenuesPage from './pages/admin/AdminVenuesPage'
import AdminScreensPage from './pages/admin/AdminScreensPage'
import AdminShowsPage from './pages/admin/AdminShowsPage'
import AdminEventsPage from './pages/admin/AdminEventsPage'
import AdminEventShowsPage from './pages/admin/AdminEventShowsPage'
import { useAuthTokenInjector } from './lib/useAuthTokenInjector'

function App() {
  useAuthTokenInjector()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      <Route path="/shows/:showId" element={<SeatSelectionPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:eventId" element={<EventDetailPage />} />
      <Route path="/event-shows/:eventShowId" element={<EventSeatSelectionPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route
        path="/plays"
        element={
          <EventsPage
            fixedCategory="PLAY,TURF"
            heading="Plays & turf near you"
            subheading="Theatre, drama, and turf grounds — picked for your city."
          />
        }
      />
      <Route
        path="/sports"
        element={
          <EventsPage
            fixedCategory="SPORTS"
            heading="Sports near you"
            subheading="Live screenings and stadium-style events, picked for your city."
          />
        }
      />
      <Route
        path="/activities"
        element={
          <EventsPage
            fixedCategory="ACTIVITY"
            heading="Activities near you"
            subheading="Workshops and hands-on experiences, picked for your city."
          />
        }
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="movies" replace />} />
        <Route path="movies" element={<AdminMoviesPage />} />
        <Route path="venues" element={<AdminVenuesPage />} />
        <Route path="screens" element={<AdminScreensPage />} />
        <Route path="shows" element={<AdminShowsPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="event-shows" element={<AdminEventShowsPage />} />
      </Route>
    </Routes>
  )
}

export default App
