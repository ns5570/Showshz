import { useState } from 'react'
import { useCities } from '../../lib/queries'
import { useAdminVenues, useCreateVenue } from '../../lib/adminQueries'
import Pagination from '../../components/Pagination'
import type { VenueRequest } from '../../types'

const EMPTY_FORM: VenueRequest = { cityId: 0, name: '', address: '', slug: '' }

export default function AdminVenuesPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAdminVenues(page)
  const venues = data?.content
  const { data: cities } = useCities()
  const createVenue = useCreateVenue()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<VenueRequest>(EMPTY_FORM)

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, cityId: cities?.[0]?.id ?? 0 })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createVenue.mutateAsync(form)
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Venues</h2>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500"
        >
          + New Venue
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 animate-scale-in rounded-lg bg-neutral-900 p-5">
          <h3 className="mb-4 font-medium">New venue</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              City
              <select
                required
                value={form.cityId}
                onChange={(e) => setForm({ ...form, cityId: Number(e.target.value) })}
                className="input"
              >
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Slug
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Address
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input"
              />
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={createVenue.isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500 disabled:opacity-50"
            >
              {createVenue.isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium transition hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-neutral-400">Loading…</p>}

      {venues && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Slug</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => (
                <tr key={venue.id} className="border-t border-neutral-800 transition hover:bg-neutral-900/50">
                  <td className="px-4 py-3 font-medium">{venue.name}</td>
                  <td className="px-4 py-3 text-neutral-400">{venue.cityName}</td>
                  <td className="px-4 py-3 text-neutral-400">{venue.address}</td>
                  <td className="px-4 py-3 text-neutral-500">{venue.slug}</td>
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
