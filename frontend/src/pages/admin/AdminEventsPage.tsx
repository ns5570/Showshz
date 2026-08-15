import { useState } from 'react'
import { useAdminEvents, useCreateEvent, useDeleteEvent, useUpdateEvent } from '../../lib/adminQueries'
import Pagination from '../../components/Pagination'
import type { EventDetail, EventRequest } from '../../types'

const CATEGORIES = ['COMEDY', 'MUSIC', 'SPORTS', 'ACTIVITY', 'EXHIBITION', 'FOOD', 'WORKSHOP', 'PLAY', 'TURF']

const EMPTY_FORM: EventRequest = {
  title: '',
  slug: '',
  category: 'COMEDY',
  description: '',
  imageUrl: '',
  durationMinutes: 90,
}

export default function AdminEventsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAdminEvents(page)
  const events = data?.content
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventRequest>(EMPTY_FORM)

  function openCreateForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEditForm(event: EventDetail) {
    setEditingId(event.id)
    setForm({
      title: event.title,
      slug: event.slug,
      category: event.category,
      description: event.description ?? '',
      imageUrl: event.imageUrl ?? '',
      durationMinutes: event.durationMinutes,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId !== null) {
      await updateEvent.mutateAsync({ id: editingId, request: form })
    } else {
      await createEvent.mutateAsync(form)
    }
    setShowForm(false)
  }

  const saving = createEvent.isPending || updateEvent.isPending

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Events</h2>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500"
        >
          + New Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 animate-scale-in rounded-lg bg-neutral-900 p-5">
          <h3 className="mb-4 font-medium">{editingId !== null ? 'Edit event' : 'New event'}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Slug">
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Category">
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Duration (minutes)">
              <input
                type="number"
                min={1}
                value={form.durationMinutes ?? ''}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value ? Number(e.target.value) : null })}
                className="input"
              />
            </Field>
            <Field label="Image URL" full>
              <input
                value={form.imageUrl ?? ''}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Description" full>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input min-h-24"
              />
            </Field>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
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

      {events && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-neutral-800 transition hover:bg-neutral-900/50">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-neutral-400">{event.category}</td>
                  <td className="px-4 py-3 text-neutral-400">{event.durationMinutes ? `${event.durationMinutes} min` : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditForm(event)}
                      className="mr-3 text-neutral-400 hover:text-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${event.title}"?`)) deleteEvent.mutate(event.id)
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
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

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 text-sm text-neutral-300 ${full ? 'sm:col-span-2' : ''}`}>
      {label}
      {children}
    </label>
  )
}
