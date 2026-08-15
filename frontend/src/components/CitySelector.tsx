import { useEffect, useState } from 'react'
import { useCities } from '../lib/queries'
import { useCity } from '../context/CityContext'
import { resolveLocation } from '../lib/geo'

export default function CitySelector() {
  const { data: cities, isLoading } = useCities()
  const { cityId, setCityId } = useCity()
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function detectLocation() {
    if (!cities) return
    setDetecting(true)
    setError(null)
    const nearest = await resolveLocation(cities)
    if (nearest) {
      setCityId(nearest.id)
    } else {
      setError("Couldn't detect your location — pick manually")
    }
    setDetecting(false)
  }

  useEffect(() => {
    if (cityId !== null || !cities || cities.length === 0) return

    setDetecting(true)
    resolveLocation(cities).then((nearest) => {
      setCityId(nearest ? nearest.id : cities[0].id)
      setDetecting(false)
    })
  }, [cityId, cities, setCityId])

  useEffect(() => {
    if (!error) return
    const timeout = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(timeout)
  }, [error])

  if (isLoading || !cities) {
    return <div className="h-9 w-32 animate-pulse rounded-md bg-neutral-800" />
  }

  function handleCityChange(nextValue: string) {
    setCityId(Number(nextValue))
  }

  return (
    <div className="relative flex items-center gap-1.5">
      <button
        type="button"
        onClick={detectLocation}
        disabled={detecting}
        title="Use my location"
        aria-label="Use my location"
        className="hover-wiggle flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:scale-110 hover:bg-neutral-700 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-90 disabled:cursor-wait disabled:opacity-70"
      >
        {detecting ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-4.5-7-8.14-7-11a7 7 0 1114 0c0 2.86-2.5 6.5-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        )}
      </button>
      <select
        value={cityId ?? ''}
        onChange={(e) => handleCityChange(e.target.value)}
        disabled={detecting}
        aria-label="Select city"
        className="rounded-full bg-neutral-800 px-3 py-2 text-sm text-neutral-100 transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-wait disabled:opacity-70"
      >
        <option value="" disabled>
          Select city
        </option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {error && (
        <div className="animate-pop-in absolute top-full left-1/2 z-50 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-md bg-neutral-800 px-3 py-2 text-xs text-red-400 shadow-lg ring-1 ring-neutral-700">
          {error}
        </div>
      )}
    </div>
  )
}
