import { Link } from 'react-router-dom'
import type { MovieSummary } from '../types'
import { enumLabel } from '../lib/movieOptions'

export default function MovieCard({ movie, badge }: { movie: MovieSummary; badge?: string }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group hover-tilt block overflow-hidden rounded-lg bg-neutral-900 shadow-md shadow-black/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/20 active:scale-95"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-800">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          />
        )}
        {badge && (
          <span className="animate-pop-in hover-wiggle absolute left-2 top-2 rounded-full bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            {badge}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition duration-200 group-hover:scale-100">
            ▶
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-neutral-100">{movie.title}</h3>
        <p className="mt-1 text-xs text-neutral-400">
          {movie.genres.map(enumLabel).join(', ')} · {movie.languages.map(enumLabel).join(', ')}
        </p>
      </div>
    </Link>
  )
}
