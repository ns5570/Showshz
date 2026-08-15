import { useState } from 'react'
import StarRating from './StarRating'
import { errorText } from '../lib/errorText'
import type { FeedbackSummary } from '../types'

export default function FeedbackWidget({
  feedback,
  onSubmit,
  isPending,
}: {
  feedback: FeedbackSummary | null
  onSubmit: (rating: number, comment: string) => Promise<unknown>
  isPending: boolean
}) {
  const [editing, setEditing] = useState(!feedback)
  const [rating, setRating] = useState(feedback?.rating ?? 0)
  const [comment, setComment] = useState(feedback?.comment ?? '')
  const [error, setError] = useState<string | null>(null)

  if (!editing && feedback) {
    return (
      <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-neutral-800/60 px-3 py-2">
        <div>
          <StarRating value={feedback.rating} readOnly size={16} />
          {feedback.comment && <p className="mt-1 text-sm text-neutral-300">{feedback.comment}</p>}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 text-xs font-medium text-red-400 hover:text-red-300"
        >
          Edit
        </button>
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2 rounded-md bg-neutral-800/60 p-3">
      <p className="text-xs font-medium text-neutral-400">Rate your experience</p>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your feedback (optional)"
        rows={2}
        maxLength={1000}
        className="w-full resize-none rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-red-500 focus:outline-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          disabled={rating === 0 || isPending}
          onClick={async () => {
            setError(null)
            try {
              await onSubmit(rating, comment)
              setEditing(false)
            } catch (err) {
              setError(errorText(err))
            }
          }}
          className="rounded-md bg-red-600 px-4 py-1.5 text-xs font-medium transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Submitting…' : feedback ? 'Update' : 'Submit'}
        </button>
        {feedback && (
          <button
            onClick={() => {
              setRating(feedback.rating)
              setComment(feedback.comment ?? '')
              setError(null)
              setEditing(false)
            }}
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
