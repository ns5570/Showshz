import { useEffect, useState } from 'react'
import {
  useAllAdminEvents,
  useAllAdminVenues,
  useAdminScreens,
  useAdminEventShows,
  useCreateEventShow,
} from '../../lib/adminQueries'
import Pagination from '../../components/Pagination'
import { formatShowTime } from '../../lib/date'

export default function AdminEventShowsPage() {
  const { data: events } = useAllAdminEvents()
  const { data: venues } = useAllAdminVenues()
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAdminEventShows(page)
  const eventShows = data?.content
  const createEventShow = useCreateEventShow()

  const [eventId, setEventId] = useState<number | null>(null)
  const [venueId, setVenueId] = useState<number | null>(null)
  const [screenId, setScreenId] = useState<number | null>(null)
  const [startTimeLocal, setStartTimeLocal] = useState('')
  const [basePrice, setBasePrice] = useState(499)

  const { data: screens } = useAdminScreens(venueId)

  useEffect(() => {
    if (eventId === null && events && events.length > 0) setEventId(events[0].id)
  }, [eventId, events])

  useEffect(() => {
    if (venueId === null && venues && venues.length > 0) setVenueId(venues[0].id)
  }, [venueId, venues])

  useEffect(() => {
    setScreenId(screens && screens.length > 0 ? screens[0].id : null)
  }, [screens])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (eventId === null || screenId === null || !startTimeLocal) return

    await createEventShow.mutateAsync({
      eventId,
      screenId,
      startTime: new Date(startTimeLocal).toISOString(),
      basePrice,
    })
    setStartTimeLocal('')
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Event Shows</h2>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-neutral-900 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm text-neutral-300">
            Event
            <select value={eventId ?? ''} onChange={(e) => setEventId(Number(e.target.value))} className="input">
              {events?.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral-300">
            Venue
            <select value={venueId ?? ''} onChange={(e) => setVenueId(Number(e.target.value))} className="input">
              {venues?.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} ({venue.cityName})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral-300">
            Screen
            <select value={screenId ?? ''} onChange={(e) => setScreenId(Number(e.target.value))} className="input">
              {screens?.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.name} ({screen.seatCount} seats)
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral-300">
            Start time
            <input
              required
              type="datetime-local"
              value={startTimeLocal}
              onChange={(e) => setStartTimeLocal(e.target.value)}
              className="input"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-neutral-300">
            Base price (₹, regular seat)
            <input
              required
              type="number"
              min={1}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="input"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={createEventShow.isPending || eventId === null || screenId === null}
          className="mt-5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500 disabled:opacity-50"
        >
          {createEventShow.isPending ? 'Creating…' : 'Create event show'}
        </button>
        <p className="mt-2 text-xs text-neutral-500">
          Premium seats price at 1.5×, recliners at 2× the base price. Seat inventory is generated automatically.
        </p>
      </form>

      {isLoading && <p className="text-neutral-400">Loading…</p>}

      {eventShows && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Screen</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">Base price</th>
              </tr>
            </thead>
            <tbody>
              {eventShows.map((show) => (
                <tr key={show.id} className="border-t border-neutral-800 transition hover:bg-neutral-900/50">
                  <td className="px-4 py-3 font-medium">{show.eventTitle}</td>
                  <td className="px-4 py-3 text-neutral-400">{show.venueName}</td>
                  <td className="px-4 py-3 text-neutral-400">{show.screenName}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(show.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' '}
                    {formatShowTime(show.startTime)}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">₹{show.basePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
