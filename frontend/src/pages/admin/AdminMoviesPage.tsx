import { useEffect, useState } from 'react'
import {
  useAdminMovies,
  useAdminScreens,
  useAllAdminVenues,
  useCreateMovieWithShows,
  useDeleteMovie,
  useUpdateMovie,
} from '../../lib/adminQueries'
import Pagination from '../../components/Pagination'
import { GENRE_OPTIONS, LANGUAGE_OPTIONS, enumLabel } from '../../lib/movieOptions'
import type { MovieDetail, MovieRequest } from '../../types'

const EMPTY_FORM: MovieRequest = {
  title: '',
  slug: '',
  description: '',
  durationMinutes: 120,
  languages: [],
  genres: [],
  releaseDate: new Date().toISOString().slice(0, 10),
  posterUrl: '',
  censorRating: '',
  trailerUrl: '',
}

interface LocationSelection {
  key: number
  venueId: number | null
  screenId: number | null
}

let nextLocationKey = 1

export default function AdminMoviesPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAdminMovies(page)
  const movies = data?.content
  const createMovieWithShows = useCreateMovieWithShows()
  const updateMovie = useUpdateMovie()
  const deleteMovie = useDeleteMovie()
  const { data: venues } = useAllAdminVenues()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<MovieRequest>(EMPTY_FORM)

  const [locations, setLocations] = useState<LocationSelection[]>([])
  const [showTimings, setShowTimings] = useState<string[]>([])
  const [basePrice, setBasePrice] = useState(220)

  function openCreateForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setLocations([])
    setShowTimings([])
    setBasePrice(220)
    setShowForm(true)
  }

  function openEditForm(movie: MovieDetail) {
    setEditingId(movie.id)
    setForm({
      title: movie.title,
      slug: movie.slug,
      description: movie.description ?? '',
      durationMinutes: movie.durationMinutes,
      languages: movie.languages,
      genres: movie.genres,
      releaseDate: movie.releaseDate,
      posterUrl: movie.posterUrl ?? '',
      censorRating: movie.censorRating ?? '',
      trailerUrl: movie.trailerUrl ?? '',
    })
    setShowForm(true)
  }

  function toggleValue(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  }

  function addLocation() {
    setLocations((prev) => [...prev, { key: nextLocationKey++, venueId: null, screenId: null }])
  }

  function removeLocation(key: number) {
    setLocations((prev) => prev.filter((loc) => loc.key !== key))
  }

  function updateLocation(key: number, next: Partial<LocationSelection>) {
    setLocations((prev) => prev.map((loc) => (loc.key === key ? { ...loc, ...next } : loc)))
  }

  function addTiming() {
    setShowTimings((prev) => [...prev, ''])
  }

  function removeTiming(index: number) {
    setShowTimings((prev) => prev.filter((_, i) => i !== index))
  }

  function updateTiming(index: number, value: string) {
    setShowTimings((prev) => prev.map((t, i) => (i === index ? value : t)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId !== null) {
      await updateMovie.mutateAsync({ id: editingId, request: form })
      setShowForm(false)
      return
    }

    const screenIds = locations
      .map((loc) => loc.screenId)
      .filter((id): id is number => id !== null)
    const startTimes = showTimings.filter((t) => t !== '').map((t) => new Date(t).toISOString())

    if (screenIds.length === 0 || startTimes.length === 0) {
      alert('Add at least one location (venue + screen) and one show timing.')
      return
    }

    await createMovieWithShows.mutateAsync({
      movie: form,
      screenIds,
      startTimes,
      basePrice,
    })
    setShowForm(false)
  }

  const saving = createMovieWithShows.isPending || updateMovie.isPending

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Movies</h2>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500"
        >
          + New Movie
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 animate-scale-in rounded-lg bg-neutral-900 p-5">
          <h3 className="mb-4 font-medium">{editingId !== null ? 'Edit movie' : 'New movie'}</h3>
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
            <Field label="Languages" full group>
              <MultiCheckboxGroup
                options={LANGUAGE_OPTIONS}
                selected={form.languages}
                onToggle={(value) => setForm({ ...form, languages: toggleValue(form.languages, value) })}
              />
            </Field>
            <Field label="Genres" full group>
              <MultiCheckboxGroup
                options={GENRE_OPTIONS}
                selected={form.genres}
                onToggle={(value) => setForm({ ...form, genres: toggleValue(form.genres, value) })}
              />
            </Field>
            <Field label="Duration (minutes)">
              <input
                required
                type="number"
                min={1}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Release date">
              <input
                required
                type="date"
                value={form.releaseDate}
                onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Censor rating">
              <input
                value={form.censorRating ?? ''}
                onChange={(e) => setForm({ ...form, censorRating: e.target.value })}
                className="input"
                placeholder="U / UA / A"
              />
            </Field>
            <Field label="Poster URL">
              <input
                value={form.posterUrl ?? ''}
                onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Trailer URL (YouTube)" full>
              <input
                value={form.trailerUrl ?? ''}
                onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
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

          {editingId === null && (
            <div className="mt-6 border-t border-neutral-800 pt-5">
              <h4 className="mb-3 text-sm font-medium text-neutral-200">Locations &amp; showtimes</h4>
              <p className="mb-3 text-xs text-neutral-500">
                A show is created for every location × showtime combination, all at the base price below.
              </p>

              <div className="mb-4 space-y-2">
                {locations.map((loc) => (
                  <LocationRow
                    key={loc.key}
                    venues={venues ?? []}
                    value={loc}
                    onChange={(next) => updateLocation(loc.key, next)}
                    onRemove={() => removeLocation(loc.key)}
                  />
                ))}
                <button
                  type="button"
                  onClick={addLocation}
                  className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-700"
                >
                  + Add location
                </button>
              </div>

              <div className="mb-4 space-y-2">
                {showTimings.map((timing, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={timing}
                      onChange={(e) => updateTiming(index, e.target.value)}
                      className="input"
                    />
                    <button
                      type="button"
                      onClick={() => removeTiming(index)}
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTiming}
                  className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-700"
                >
                  + Add showtime
                </button>
              </div>

              <Field label="Base price (₹, regular seat)">
                <input
                  type="number"
                  min={1}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="input"
                />
              </Field>
            </div>
          )}

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

      {movies && (
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Genres</th>
                <th className="px-4 py-3">Languages</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Release date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-t border-neutral-800 transition hover:bg-neutral-900/50">
                  <td className="px-4 py-3 font-medium">{movie.title}</td>
                  <td className="px-4 py-3 text-neutral-400">{movie.genres.map(enumLabel).join(', ')}</td>
                  <td className="px-4 py-3 text-neutral-400">{movie.languages.map(enumLabel).join(', ')}</td>
                  <td className="px-4 py-3 text-neutral-400">{movie.durationMinutes} min</td>
                  <td className="px-4 py-3 text-neutral-400">{movie.releaseDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditForm(movie)}
                      className="mr-3 text-neutral-400 hover:text-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${movie.title}"?`)) deleteMovie.mutate(movie.id)
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

function LocationRow({
  venues,
  value,
  onChange,
  onRemove,
}: {
  venues: { id: number; name: string; cityName: string }[]
  value: LocationSelection
  onChange: (next: Partial<LocationSelection>) => void
  onRemove: () => void
}) {
  const { data: screens } = useAdminScreens(value.venueId)

  useEffect(() => {
    if (value.venueId !== null && value.screenId === null && screens && screens.length > 0) {
      onChange({ screenId: screens[0].id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screens, value.venueId])

  return (
    <div className="flex items-center gap-2">
      <select
        value={value.venueId ?? ''}
        onChange={(e) => onChange({ venueId: Number(e.target.value), screenId: null })}
        className="input"
      >
        <option value="" disabled>
          Select venue
        </option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name} ({venue.cityName})
          </option>
        ))}
      </select>
      <select
        value={value.screenId ?? ''}
        onChange={(e) => onChange({ screenId: Number(e.target.value) })}
        className="input"
        disabled={value.venueId === null}
      >
        <option value="" disabled>
          Select screen
        </option>
        {screens?.map((screen) => (
          <option key={screen.id} value={screen.id}>
            {screen.name} ({screen.seatCount} seats)
          </option>
        ))}
      </select>
      <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:text-red-400">
        Remove
      </button>
    </div>
  )
}

function MultiCheckboxGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-neutral-700 bg-neutral-950 p-3">
      {options.map((option) => {
        const active = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              active ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {enumLabel(option)}
          </button>
        )
      })}
    </div>
  )
}

function Field({
  label,
  children,
  full,
  group,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
  group?: boolean
}) {
  const className = `flex flex-col gap-1 text-sm text-neutral-300 ${full ? 'sm:col-span-2' : ''}`
  // A <label> can only be implicitly associated with a single form control, so a group of
  // several buttons (checkbox-style toggles) must use a plain wrapper instead.
  if (group) {
    return (
      <div className={className}>
        <span>{label}</span>
        {children}
      </div>
    )
  }
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  )
}
