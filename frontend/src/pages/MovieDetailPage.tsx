import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { useMovie, useShows } from '../lib/queries'
import { formatShowTime, toIsoDate } from '../lib/date'
import TrailerModal from '../components/TrailerModal'
import Footer from '../components/Footer'
import type { Show } from '../types'
import { enumLabel } from '../lib/movieOptions'

function groupByVenue(shows: Show[]): Map<string, Show[]> {
  const groups = new Map<string, Show[]>()
  for (const show of shows) {
    const key = show.venueName
    const existing = groups.get(key) ?? []
    existing.push(show)
    groups.set(key, existing)
  }
  return groups
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const id = Number(movieId)
  const { cityId } = useCity()
  const [trailerOpen, setTrailerOpen] = useState(false)

  const dateOptions = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return [today, tomorrow]
  }, [])
  const todayIso = toIsoDate(dateOptions[0])
  const maxDateIso = '2027-12-31'

  const [selectedDate, setSelectedDate] = useState(() => todayIso)

  const { data: movie, isLoading: movieLoading } = useMovie(id)
  const { data: shows, isLoading: showsLoading } = useShows(id, cityId, selectedDate)

  if (movieLoading || !movie) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
        <div className="flex animate-pulse flex-col gap-6 sm:flex-row">
          <div className="h-72 w-48 rounded-lg bg-neutral-800" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-1/2 rounded bg-neutral-800" />
            <div className="h-4 w-1/3 rounded bg-neutral-800" />
            <div className="h-20 w-full max-w-xl rounded bg-neutral-800" />
          </div>
        </div>
      </div>
    )
  }

  const upcomingShows = shows?.filter((show) => new Date(show.startTime) > new Date())
  const venueGroups = upcomingShows ? groupByVenue(upcomingShows) : new Map<string, Show[]>()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
        <Link
          to="/"
          className="text-sm text-neutral-400 transition hover:translate-x-[-2px] hover:text-neutral-200"
        >
          ← Back
        </Link>
      </header>

      <main className="animate-fade-in px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-lg shadow-black/40 sm:w-56">
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full object-cover" />}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{movie.title}</h1>
            <p className="mt-1 text-sm text-neutral-400">
              {movie.genres.map(enumLabel).join(', ')} · {movie.languages.map(enumLabel).join(', ')} ·{' '}
              {movie.durationMinutes} min
              {movie.censorRating && ` · ${movie.censorRating}`}
            </p>
            {movie.description && <p className="mt-4 max-w-xl text-sm text-neutral-300">{movie.description}</p>}

            {movie.trailerUrl && (
              <button
                onClick={() => setTrailerOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.03] hover:bg-red-500 active:scale-[0.98]"
              >
                <span>▶</span> Watch Trailer
              </button>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Showtimes</h2>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {dateOptions.map((date) => {
              const iso = toIsoDate(date)
              const isSelected = iso === selectedDate
              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-950'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </button>
              )
            })}
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              or pick a date
              <input
                type="date"
                min={todayIso}
                max={maxDateIso}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </label>
          </div>

          {showsLoading && (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-neutral-900" />
              ))}
            </div>
          )}

          {!showsLoading && upcomingShows && upcomingShows.length === 0 && (
            <p className="text-neutral-400">No shows for this date in your city.</p>
          )}

          <div className="space-y-6">
            {Array.from(venueGroups.entries()).map(([venueName, venueShows], i) => (
              <div
                key={venueName}
                className="animate-fade-in rounded-lg bg-neutral-900 p-4 transition hover:bg-neutral-900/80"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                <h3 className="mb-3 font-medium">{venueName}</h3>
                <div className="flex flex-wrap gap-2">
                  {venueShows
                    .slice()
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((show) => (
                      <Link
                        key={show.id}
                        to={`/shows/${show.id}`}
                        className="rounded-md border border-neutral-700 px-3 py-2 text-sm transition hover:scale-[1.05] hover:border-red-500 hover:text-red-400"
                      >
                        {formatShowTime(show.startTime)}
                        <span className="ml-2 text-neutral-500">₹{show.basePrice}</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {trailerOpen && movie.trailerUrl && (
        <TrailerModal trailerUrl={movie.trailerUrl} onClose={() => setTrailerOpen(false)} />
      )}
    </div>
  )
}
