import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MovieSummary } from '../types'
import { enumLabel } from '../lib/movieOptions'

export default function BannerCarousel({ movies }: { movies: MovieSummary[] }) {
  const [index, setIndex] = useState(0)
  const slides = movies.slice(0, 5)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="relative h-64 w-full overflow-hidden sm:h-80">
      {slides.map((movie, i) => (
        <Link
          key={movie.id}
          to={`/movies/${movie.id}`}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt=""
              aria-hidden="true"
              className={`h-full w-full object-cover blur-2xl brightness-[0.4] ${i === index ? 'animate-kenburns' : 'scale-110'}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/10 to-transparent sm:to-neutral-950/40" />

          <div className="absolute inset-0 flex flex-col justify-end gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="min-w-0">
              {i === index && (
                <div key={index} className="animate-fade-in">
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400">🔥 Now Showing</p>
                  <h2 className="mt-1 font-display text-2xl font-bold sm:text-4xl">{movie.title}</h2>
                  <p className="mt-1 text-sm text-neutral-300">
                    {movie.genres.map(enumLabel).join(', ')} · {movie.languages.map(enumLabel).join(', ')}
                  </p>
                  <span className="shine-hover animate-glow-pulse mt-4 inline-block rounded-full bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 active:scale-90">
                    Book Now 🎟️
                  </span>
                </div>
              )}
            </div>

            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="hidden aspect-[2/3] h-full max-h-[90%] shrink-0 rounded-lg object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:block"
              />
            )}
          </div>
        </Link>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-3 right-6 flex gap-1.5 sm:bottom-4">
          {slides.map((movie, i) => (
            <button
              key={movie.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-red-500' : 'w-1.5 bg-white/40 hover:w-3 hover:bg-white/70'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
