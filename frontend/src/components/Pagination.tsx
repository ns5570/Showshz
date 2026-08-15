export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="rounded-full bg-neutral-800 px-3 py-1.5 transition hover:scale-105 hover:bg-neutral-700 active:scale-90 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-neutral-800"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="rounded-full bg-neutral-800 px-3 py-1.5 transition hover:scale-105 hover:bg-neutral-700 active:scale-90 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-neutral-800"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
