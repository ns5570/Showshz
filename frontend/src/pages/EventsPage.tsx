import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BlogSection from '../components/BlogSection'
import { useCity } from '../context/CityContext'
import { useEvents } from '../lib/eventQueries'

const BLOG_HEADING: Record<string, string> = {
  SPORTS: 'From the sidelines',
  ACTIVITY: 'Guides & stories',
  EVENTS: 'From the blog',
}

const CATEGORY_COLOR: Record<string, string> = {
  MUSIC: 'bg-purple-600',
  COMEDY: 'bg-amber-600',
  EXHIBITION: 'bg-sky-600',
  FOOD: 'bg-emerald-600',
  WORKSHOP: 'bg-pink-600',
  SPORTS: 'bg-blue-600',
  ACTIVITY: 'bg-emerald-600',
  PLAY: 'bg-rose-600',
  TURF: 'bg-lime-600',
}

const ALL_CATEGORIES = ['COMEDY', 'MUSIC', 'SPORTS', 'ACTIVITY', 'EXHIBITION', 'FOOD', 'WORKSHOP', 'PLAY', 'TURF']

export default function EventsPage({
  fixedCategory,
  heading = 'Live events near you',
  subheading = 'Concerts, comedy, art and more — curated for your city.',
}: {
  fixedCategory?: string
  heading?: string
  subheading?: string
}) {
  const { cityId } = useCity()
  const [category, setCategory] = useState<string | undefined>(fixedCategory)
  const { data: events, isLoading } = useEvents(cityId, category)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />

      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-neutral-950 to-neutral-950 px-6 py-14">
        <div className="animate-float pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="animate-float-delayed pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-pink-600/10 blur-3xl" />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1>
        <p className="mt-2 max-w-md text-neutral-400">{subheading}</p>
      </div>

      <main className="px-6 py-8">
        {!fixedCategory && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory(undefined)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                category === undefined
                  ? 'bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 text-white shadow-md shadow-fuchsia-600/30'
                  : 'bg-neutral-800 text-neutral-300 hover:scale-105 hover:bg-neutral-700'
              }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? 'bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 text-white shadow-md shadow-fuchsia-600/30'
                    : 'bg-neutral-800 text-neutral-300 hover:scale-105 hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && events && events.length === 0 && (
          <p className="text-neutral-400">No events in your city right now — check back soon.</p>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="group animate-fade-in overflow-hidden rounded-lg bg-neutral-900 shadow-md shadow-black/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/20"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                {event.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-800">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white ${CATEGORY_COLOR[event.category] ?? 'bg-neutral-700'}`}
                    >
                      {event.category}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium">{event.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <BlogSection
          category={fixedCategory ?? 'EVENTS'}
          heading={BLOG_HEADING[fixedCategory ?? 'EVENTS'] ?? 'From the blog'}
        />
      </main>

      <Footer />
    </div>
  )
}
