import { Link } from 'react-router-dom'
import { useCity } from '../context/CityContext'
import { useEvents } from '../lib/eventQueries'
import { useReveal } from '../lib/useReveal'
import type { EventSummary } from '../types'

export default function TrendingEvents() {
  const { cityId } = useCity()
  const { data: events } = useEvents(cityId)

  if (!events || events.length === 0) return null

  return (
    <section className="px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Trending events</h2>
        <Link to="/events" className="group flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          See all <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {events.slice(0, 6).map((event, i) => (
          <TrendingEventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  )
}

function TrendingEventCard({ event, index }: { event: EventSummary; index: number }) {
  const { ref, className } = useReveal<HTMLAnchorElement>()

  return (
    <Link
      ref={ref}
      to={`/events/${event.id}`}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={`${className} hover-tilt w-56 shrink-0 overflow-hidden rounded-lg bg-neutral-900 shadow-md shadow-black/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-fuchsia-600/20 active:scale-95`}
    >
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-neutral-800">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-3">
        <p className="truncate text-sm font-medium">{event.title}</p>
        <p className="mt-1 text-xs text-neutral-500">{event.category}</p>
      </div>
    </Link>
  )
}
