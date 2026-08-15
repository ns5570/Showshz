import { useState } from 'react'

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: number
}) {
  const [justPicked, setJustPicked] = useState<number | null>(null)

  function handlePick(n: number) {
    onChange?.(n)
    setJustPicked(n)
  }

  return (
    <div className="flex gap-0.5" role={readOnly ? undefined : 'radiogroup'} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => handlePick(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={n <= value}
          className={`leading-none transition ${readOnly ? 'cursor-default' : 'hover-wiggle cursor-pointer hover:scale-110'} ${
            n <= value ? 'text-amber-400' : 'text-neutral-700'
          } ${n === justPicked ? 'animate-bounce-once' : ''}`}
          onAnimationEnd={() => n === justPicked && setJustPicked(null)}
          style={{ fontSize: size }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
