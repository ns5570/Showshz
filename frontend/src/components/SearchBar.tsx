import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../lib/queries'
import { useCity } from '../context/CityContext'
import { enumLabel } from '../lib/movieOptions'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { setCityId } = useCity()

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 250)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isFetching } = useSearch(debounced)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const hasResults = data && (data.movies.length > 0 || data.venues.length > 0)

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="focus-glow relative rounded-md">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search movies, PVR, INOX…"
          className="w-full rounded-full bg-neutral-800 py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {open && debounced.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 shadow-xl animate-fade-in">
          {isFetching && <p className="px-4 py-3 text-sm text-neutral-500">Searching…</p>}

          {!isFetching && !hasResults && <p className="px-4 py-3 text-sm text-neutral-500">No results for "{debounced}"</p>}

          {!isFetching && data && data.movies.length > 0 && (
            <div className="border-b border-neutral-800 py-1">
              <p className="px-4 py-1 text-xs uppercase tracking-wide text-neutral-500">Movies</p>
              {data.movies.map((movie, i) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    navigate(`/movies/${movie.id}`)
                    setOpen(false)
                    setQuery('')
                  }}
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                  className="animate-fade-in flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition hover:bg-neutral-800 hover:pl-5"
                >
                  {movie.posterUrl && (
                    <img src={movie.posterUrl} alt="" className="h-10 w-7 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-neutral-100">{movie.title}</p>
                    <p className="text-xs text-neutral-500">
                      {movie.genres.map(enumLabel).join(', ')} · {movie.languages.map(enumLabel).join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isFetching && data && data.venues.length > 0 && (
            <div className="py-1">
              <p className="px-4 py-1 text-xs uppercase tracking-wide text-neutral-500">Cinemas</p>
              {data.venues.map((venue, i) => (
                <button
                  key={venue.id}
                  onClick={() => {
                    setCityId(venue.cityId)
                    navigate('/')
                    setOpen(false)
                    setQuery('')
                  }}
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                  className="animate-fade-in flex w-full flex-col items-start px-4 py-2 text-left text-sm transition hover:bg-neutral-800 hover:pl-5"
                >
                  <span className="font-medium text-neutral-100">{venue.name}</span>
                  <span className="text-xs text-neutral-500">{venue.cityName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
