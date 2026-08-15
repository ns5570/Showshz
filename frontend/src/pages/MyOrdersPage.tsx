import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FeedbackWidget from '../components/FeedbackWidget'
import TicketQrModal from '../components/TicketQrModal'
import { useMyBookings, useSubmitFeedback } from '../lib/bookingQueries'
import { useMyEventBookings, useSubmitEventFeedback } from '../lib/eventBookingQueries'
import { formatShowDate, formatShowTime } from '../lib/date'
import type { BookingSeatSummary, FeedbackSummary } from '../types'

interface UnifiedOrder {
  kind: 'movie' | 'event'
  id: number
  bookingReference: string
  status: string
  title: string
  venueName: string
  screenName: string
  startTime: string
  totalAmount: number
  seats: BookingSeatSummary[]
  feedback: FeedbackSummary | null
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-600/20 text-green-400',
  CANCELLED: 'bg-red-600/20 text-red-400',
}

function OrderCard({ order }: { order: UnifiedOrder }) {
  const isPast = new Date(order.startTime).getTime() < Date.now()
  const [showQr, setShowQr] = useState(false)
  const submitMovieFeedback = useSubmitFeedback()
  const submitEventFeedback = useSubmitEventFeedback()

  const isPending = order.kind === 'movie' ? submitMovieFeedback.isPending : submitEventFeedback.isPending

  const handleSubmit = (rating: number, comment: string) => {
    const request = { rating, comment: comment.trim() || null }
    return order.kind === 'movie'
      ? submitMovieFeedback.mutateAsync({ bookingId: order.id, request })
      : submitEventFeedback.mutateAsync({ bookingId: order.id, request })
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
            {order.kind === 'movie' ? 'Movie' : 'Event'}
          </span>
          <h3 className="mt-1.5 font-semibold text-neutral-100">{order.title}</h3>
          <p className="text-sm text-neutral-400">
            {order.venueName} · {order.screenName}
          </p>
          <p className="text-sm text-neutral-400">
            {formatShowDate(order.startTime)} · {formatShowTime(order.startTime)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${
            STATUS_STYLES[order.status] ?? 'bg-neutral-800 text-neutral-300'
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800 pt-3 text-sm">
        <p className="text-neutral-400">
          Seats: <span className="text-neutral-200">{order.seats.map((s) => `${s.rowLabel}${s.seatNumber}`).join(', ')}</span>
        </p>
        <p className="font-medium text-neutral-100">₹{order.totalAmount.toFixed(2)}</p>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-neutral-500">Ref: {order.bookingReference}</p>
        {order.status === 'CONFIRMED' && (
          <button
            onClick={() => setShowQr(true)}
            className="flex items-center gap-1.5 rounded-md border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 transition hover:border-red-500 hover:text-red-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path strokeLinecap="round" d="M14 14h3v3h-3zM20 14v3M17 20h3" />
            </svg>
            View ticket
          </button>
        )}
      </div>

      {isPast && order.status === 'CONFIRMED' && (
        <FeedbackWidget feedback={order.feedback} onSubmit={handleSubmit} isPending={isPending} />
      )}

      {showQr && (
        <TicketQrModal
          bookingReference={order.bookingReference}
          title={order.title}
          onClose={() => setShowQr(false)}
        />
      )}
    </div>
  )
}

export default function MyOrdersPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { data: movieBookings, isLoading: moviesLoading } = useMyBookings(Boolean(isSignedIn))
  const { data: eventBookings, isLoading: eventsLoading } = useMyEventBookings(Boolean(isSignedIn))

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">Loading…</div>
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Header />
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
          <p className="text-lg font-medium">Sign in to see your orders</p>
          <p className="max-w-sm text-sm text-neutral-400">
            Your movie, event, and activity bookings — with dates, seats, and feedback — all in one place.
          </p>
          <SignInButton mode="modal">
            <button className="mt-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium transition hover:bg-red-500">
              Sign in
            </button>
          </SignInButton>
        </div>
        <Footer />
      </div>
    )
  }

  const isLoading = moviesLoading || eventsLoading

  const orders: UnifiedOrder[] = [
    ...(movieBookings ?? []).map(
      (b): UnifiedOrder => ({
        kind: 'movie',
        id: b.id,
        bookingReference: b.bookingReference,
        status: b.status,
        title: b.movieTitle,
        venueName: b.venueName,
        screenName: b.screenName,
        startTime: b.startTime,
        totalAmount: b.totalAmount,
        seats: b.seats,
        feedback: b.feedback,
      }),
    ),
    ...(eventBookings ?? []).map(
      (b): UnifiedOrder => ({
        kind: 'event',
        id: b.id,
        bookingReference: b.bookingReference,
        status: b.status,
        title: b.eventTitle,
        venueName: b.venueName,
        screenName: b.screenName,
        startTime: b.startTime,
        totalAmount: b.totalAmount,
        seats: b.seats,
        feedback: b.feedback,
      }),
    ),
  ]

  const now = Date.now()
  const upcoming = orders
    .filter((o) => new Date(o.startTime).getTime() >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  const past = orders
    .filter((o) => new Date(o.startTime).getTime() < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <p className="mt-1 text-sm text-neutral-400">Movies, events, and activities you've booked.</p>

        {isLoading && (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-neutral-900" />
            ))}
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-neutral-300">No bookings yet</p>
            <p className="max-w-sm text-sm text-neutral-500">
              Once you book a movie, event, or activity, it'll show up here.
            </p>
            <Link to="/" className="mt-2 text-sm text-red-400 hover:text-red-300">
              Browse what's on →
            </Link>
          </div>
        )}

        {!isLoading && upcoming.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map((o) => (
                <OrderCard key={`${o.kind}-${o.id}`} order={o} />
              ))}
            </div>
          </section>
        )}

        {!isLoading && past.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-neutral-400 uppercase">Past</h2>
            <div className="space-y-3">
              {past.map((o) => (
                <OrderCard key={`${o.kind}-${o.id}`} order={o} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
