import { useEffect, useState } from 'react'
import { useAllAdminVenues, useAdminScreens, useCreateScreen } from '../../lib/adminQueries'

export default function AdminScreensPage() {
  const { data: venues } = useAllAdminVenues()
  const [venueId, setVenueId] = useState<number | null>(null)
  const [screenName, setScreenName] = useState('')

  useEffect(() => {
    if (venueId === null && venues && venues.length > 0) {
      setVenueId(venues[0].id)
    }
  }, [venueId, venues])

  const { data: screens, isLoading } = useAdminScreens(venueId)
  const createScreen = useCreateScreen(venueId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!screenName.trim()) return
    await createScreen.mutateAsync({ name: screenName.trim() })
    setScreenName('')
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">Screens</h2>

      <label className="mb-6 flex max-w-xs flex-col gap-1 text-sm text-neutral-300">
        Venue
        <select
          value={venueId ?? ''}
          onChange={(e) => setVenueId(Number(e.target.value))}
          className="input"
        >
          {venues?.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name} ({venue.cityName})
            </option>
          ))}
        </select>
      </label>

      <form onSubmit={handleSubmit} className="mb-8 flex items-end gap-3 rounded-lg bg-neutral-900 p-5">
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          New screen name
          <input
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            placeholder="Audi 3"
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={createScreen.isPending || venueId === null}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500 disabled:opacity-50"
        >
          {createScreen.isPending ? 'Creating…' : 'Add screen'}
        </button>
        <p className="text-xs text-neutral-500">Auto-generates a 40-seat layout (rows A–E, 8 seats each).</p>
      </form>

      {isLoading && <p className="text-neutral-400">Loading…</p>}

      {screens && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Seats</th>
              </tr>
            </thead>
            <tbody>
              {screens.map((screen) => (
                <tr key={screen.id} className="border-t border-neutral-800 transition hover:bg-neutral-900/50">
                  <td className="px-4 py-3 font-medium">{screen.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{screen.seatCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
