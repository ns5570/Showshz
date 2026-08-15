import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { useEvent, useEventShows } from '../lib/eventQueries'
import { formatShowTime, toIsoDate } from '../lib/date'
import Footer from '../components/Footer'
import type { EventShow } from '../types'

function groupByVenue(shows: EventShow[]): Map<string, EventShow[]> {
  const groups = new Map<string, EventShow[]>()
  for (const show of shows) {
    const existing = groups.get(show.venueName) ?? []
    existing.push(show)
    groups.set(show.venueName, existing)
  }
  return groups
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const id = Number(eventId)
  const { cityId } = useCity()

  const dateOptions = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return [today, tomorrow]
  }, [])

  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(dateOptions[0]))

  const { data: event, isLoading: eventLoading } = useEvent(id)
  const { data: shows, isLoading: showsLoading } = useEventShows(id, cityId, selectedDate)

  if (eventLoading || !event) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
        <p className="text-neutral-400">Loading…</p>
      </div>
    )
  }

  const upcomingShows = shows?.filter((show) => new Date(show.startTime) > new Date())
  const venueGroups = upcomingShows ? groupByVenue(upcomingShows) : new Map<string, EventShow[]>()

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
        <Link to="/events" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Back
        </Link>
      </header>

      <main className="animate-fade-in px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-lg shadow-black/40 sm:w-56">
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="aspect-[2/3] w-full object-cover" />}
          </div>

          <div>
            <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
              {event.category}
            </span>
            <h1 className="mt-2 text-2xl font-semibold">{event.title}</h1>
            {event.durationMinutes && (
              <p className="mt-1 text-sm text-neutral-400">{event.durationMinutes} min</p>
            )}
            {event.description && <p className="mt-4 max-w-xl text-sm text-neutral-300">{event.description}</p>}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Showtimes</h2>

          <div className="mb-5 flex gap-2">
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
                        to={`/event-shows/${show.id}`}
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
    </div>
  )
}
