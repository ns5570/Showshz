import Header from '../components/Header'
import Footer from '../components/Footer'
import BannerCarousel from '../components/BannerCarousel'
import TrendingEvents from '../components/TrendingEvents'
import MovieCard from '../components/MovieCard'
import { useCity } from '../context/CityContext'
import { useMovies } from '../lib/queries'

export default function HomePage() {
  const { cityId } = useCity()
  const { data: movies, isLoading } = useMovies(cityId)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />

      {movies && movies.length > 0 ? (
        <BannerCarousel movies={movies} />
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-neutral-950 to-neutral-950 px-6 py-14">
          <div className="animate-float pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="animate-float-delayed pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-700/10 blur-3xl" />
          <div className="animate-float pointer-events-none absolute -bottom-10 right-10 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" style={{ animationDelay: '2s' }} />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book your <span className="text-gradient">next show</span>.
          </h2>
          <p className="mt-2 max-w-md text-neutral-400">
            Movies, showtimes, and seats — picked for your city, ready in a few taps.
          </p>
        </div>
      )}

      <main className="px-6 py-8">
        <h2 className="mb-4 text-lg font-semibold">
          <span className="hover-wiggle inline-block">🎬</span> Now showing
        </h2>

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton aspect-[2/3] w-full rounded-lg" />
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && movies && movies.length === 0 && (
          <p className="text-neutral-400">No movies playing in this city right now.</p>
        )}

        {movies && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie, i) => (
              <div
                key={movie.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
              >
                <MovieCard movie={movie} badge={i < 3 ? '🔥 Trending' : undefined} />
              </div>
            ))}
          </div>
        )}
      </main>

      <TrendingEvents />
      <Footer />
    </div>
  )
}
