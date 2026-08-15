import { useState } from 'react'

export interface GridSeat {
  id: number
  rowLabel: string
  seatNumber: number
  seatType: string
  price: number
  status: string
}

const SEAT_TYPE_STYLE: Record<string, string> = {
  REGULAR: 'border-neutral-600 text-neutral-300 hover:border-neutral-400',
  PREMIUM: 'border-amber-600 text-amber-400 hover:border-amber-400',
  RECLINER: 'border-purple-600 text-purple-400 hover:border-purple-400',
}

function groupByRow(seats: GridSeat[]): [string, GridSeat[]][] {
  const groups = new Map<string, GridSeat[]>()
  for (const seat of seats) {
    const row = groups.get(seat.rowLabel) ?? []
    row.push(seat)
    groups.set(seat.rowLabel, row)
  }
  return Array.from(groups.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([row, list]) => [row, list.slice().sort((x, y) => x.seatNumber - y.seatNumber)])
}

export default function SeatGrid({
  seats,
  selected,
  disabled,
  onToggle,
}: {
  seats: GridSeat[]
  selected: Set<number>
  disabled: boolean
  onToggle: (seat: GridSeat) => void
}) {
  const rows = groupByRow(seats)

  return (
    <>
      <div className="mb-8 flex justify-center">
        <div className="h-2 w-full max-w-2xl rounded-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
      </div>
      <p className="mb-8 text-center text-xs uppercase tracking-widest text-neutral-500">Screen this way</p>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 overflow-x-auto">
        {rows.map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-3">
            <span className="w-4 text-xs text-neutral-500">{row}</span>
            <div className="flex gap-1.5">
              {rowSeats.map((seat, i) => (
                <SeatButton
                  key={seat.id}
                  seat={seat}
                  selected={selected.has(seat.id)}
                  disabled={disabled}
                  onClick={() => onToggle(seat)}
                  gapBefore={i === 7}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-4 text-xs text-neutral-400">
        <Legend swatch="border-neutral-600" label="Regular" />
        <Legend swatch="border-amber-600" label="Premium" />
        <Legend swatch="border-purple-600" label="Recliner" />
        <Legend swatch="bg-red-600 border-red-600" label="Selected" />
        <Legend swatch="border-neutral-800 bg-neutral-900 opacity-50" label="Unavailable" />
      </div>
    </>
  )
}

function SeatButton({
  seat,
  selected,
  disabled,
  onClick,
  gapBefore,
}: {
  seat: GridSeat
  selected: boolean
  disabled: boolean
  onClick: () => void
  gapBefore: boolean
}) {
  const unavailable = seat.status !== 'AVAILABLE'
  const [shaking, setShaking] = useState(false)
  const base = 'h-7 w-7 rounded-t-md border text-[10px] font-medium transition flex items-center justify-center'
  const style = selected
    ? 'bg-red-600 border-red-600 text-white scale-110 animate-seat-select'
    : unavailable
      ? 'border-neutral-800 bg-neutral-900 text-neutral-700 opacity-50 cursor-not-allowed'
      : `bg-transparent ${SEAT_TYPE_STYLE[seat.seatType]}`

  function handleClick() {
    if (unavailable) {
      setShaking(true)
      window.setTimeout(() => setShaking(false), 400)
      return
    }
    onClick()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={`${seat.rowLabel}${seat.seatNumber} · ${seat.seatType} · ₹${seat.price}${unavailable ? ' · Unavailable' : ''}`}
      className={`${base} ${style} ${gapBefore ? 'ml-3' : ''} ${shaking ? 'animate-shake' : ''}`}
    >
      {seat.seatNumber}
    </button>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm border ${swatch}`} />
      {label}
    </div>
  )
}
