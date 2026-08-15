import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { formatShowTime } from '../lib/date'

export default function BookingConfirmedCard({
  bookingReference,
  title,
  venueName,
  screenName,
  startTime,
  seats,
  totalAmount,
}: {
  bookingReference: string
  title: string
  venueName: string
  screenName: string
  startTime: string
  seats: { rowLabel: string; seatNumber: number }[]
  totalAmount: number
}) {
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      startVelocity: 40,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#f97316', '#f472b6', '#fbbf24'],
    })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-md animate-scale-in rounded-lg bg-neutral-900 p-6 text-center">
        <div className="animate-bounce-once mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600/20 text-2xl text-green-400 shadow-lg shadow-green-600/20">
          ✓
        </div>
        <h1 className="font-display text-xl font-bold">You're in! 🎉</h1>
        <p className="mt-1 text-sm text-neutral-400">A confirmation email has been sent to your inbox.</p>
        <p className="mt-1 text-sm text-neutral-400">Reference: {bookingReference}</p>

        <div className="mt-6 space-y-1 text-left text-sm">
          <p className="font-medium">{title}</p>
          <p className="text-neutral-400">
            {venueName} · {screenName}
          </p>
          <p className="text-neutral-400">{formatShowTime(startTime)}</p>
          <p className="mt-3 text-neutral-400">
            Seats: {seats.map((s) => `${s.rowLabel}${s.seatNumber}`).join(', ')}
          </p>
          <p className="font-medium">Total paid: ₹{totalAmount.toFixed(2)}</p>
        </div>

        <Link
          to="/"
          className="shine-hover mt-6 inline-block rounded-md bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 px-6 py-2.5 font-semibold transition hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
