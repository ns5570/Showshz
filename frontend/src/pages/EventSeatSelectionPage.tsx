import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import { useEventSeatMap, useCreateEventHold, useConfirmEventBooking } from '../lib/eventBookingQueries'
import { formatShowTime } from '../lib/date'
import { errorText } from '../lib/errorText'
import SeatGrid, { type GridSeat } from '../components/SeatGrid'
import BookingConfirmedCard from '../components/BookingConfirmedCard'
import type { EventBookingResponse } from '../types'

type FlowState = 'selecting' | 'holding' | 'held' | 'confirming' | 'confirmed'

export default function EventSeatSelectionPage() {
  const { eventShowId } = useParams<{ eventShowId: string }>()
  const id = Number(eventShowId)
  const { isSignedIn } = useAuth()

  const { data: seatMap, isLoading, error, refetch } = useEventSeatMap(id)
  const createHold = useCreateEventHold()
  const confirmBooking = useConfirmEventBooking()

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [flow, setFlow] = useState<FlowState>('selecting')
  const [holdId, setHoldId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [booking, setBooking] = useState<EventBookingResponse | null>(null)

  const gridSeats: GridSeat[] = seatMap?.seats.map((s) => ({ id: s.eventShowSeatId, ...s })) ?? []
  const selectedSeats = seatMap?.seats.filter((s) => selected.has(s.eventShowSeatId)) ?? []
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  function toggleSeat(seat: GridSeat) {
    if (seat.status !== 'AVAILABLE' || flow !== 'selecting') return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(seat.id)) {
        next.delete(seat.id)
      } else {
        next.add(seat.id)
      }
      return next
    })
  }

  async function handleProceed() {
    setErrorMessage(null)
    setFlow('holding')
    try {
      const result = await createHold.mutateAsync({ showId: id, showSeatIds: Array.from(selected) })
      setHoldId(result.holdId)
      setFlow('held')
    } catch (err) {
      setFlow('selecting')
      setErrorMessage(errorText(err))
      refetch()
    }
  }

  async function handlePay() {
    if (!holdId) return
    setErrorMessage(null)
    setFlow('confirming')
    try {
      const result = await confirmBooking.mutateAsync(holdId)
      setBooking(result)
      setFlow('confirmed')
    } catch (err) {
      setFlow('held')
      setErrorMessage(errorText(err))
    }
  }

  if (isLoading || !seatMap) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
        <p className="text-neutral-400">Loading seats…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
        <p className="text-red-400">Could not load this event.</p>
      </div>
    )
  }

  if (flow === 'confirmed' && booking) {
    return (
      <BookingConfirmedCard
        bookingReference={booking.bookingReference}
        title={booking.eventTitle}
        venueName={booking.venueName}
        screenName={booking.screenName}
        startTime={booking.startTime}
        seats={booking.seats}
        totalAmount={booking.totalAmount}
      />
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 pb-28 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
        <Link to="/events" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Back
        </Link>
        <h1 className="mt-2 text-lg font-semibold">{seatMap.eventTitle}</h1>
        <p className="text-sm text-neutral-400">
          {seatMap.venueName} · {seatMap.screenName} · {formatShowTime(seatMap.startTime)}
        </p>
      </header>

      <main className="animate-fade-in px-6 py-8">
        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <SeatGrid seats={gridSeats} selected={selected} disabled={flow !== 'selecting'} onToggle={toggleSeat} />

        {flow === 'held' && (
          <div className="mx-auto mt-10 max-w-md rounded-lg bg-neutral-900 p-5 text-center">
            <p className="text-sm text-neutral-400">Seats held for 5 minutes. Complete payment to confirm.</p>
            <button
              onClick={handlePay}
              disabled={confirmBooking.isPending}
              className="mt-4 w-full rounded-md bg-red-600 px-4 py-3 font-medium transition hover:bg-red-500 disabled:opacity-50"
            >
              {confirmBooking.isPending ? 'Processing payment…' : `Pay ₹${totalAmount.toFixed(2)} & Confirm`}
            </button>
          </div>
        )}
      </main>

      {flow === 'selecting' && selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800 bg-neutral-900/95 px-6 py-4 backdrop-blur animate-fade-in">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div key={selected.size} className="animate-bump">
              <span className="font-medium">{selected.size} seat{selected.size > 1 ? 's' : ''}</span>
              <span className="ml-2 text-neutral-400">₹{totalAmount.toFixed(2)}</span>
            </div>
            {isSignedIn ? (
              <button
                onClick={handleProceed}
                disabled={createHold.isPending}
                className="rounded-md bg-red-600 px-6 py-2.5 font-medium transition hover:bg-red-500 disabled:opacity-50"
              >
                {createHold.isPending ? 'Holding…' : 'Proceed'}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-md bg-red-600 px-6 py-2.5 font-medium transition hover:bg-red-500">
                  Sign in to book
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
