import { useEffect } from 'react'
import { extractYouTubeId } from '../lib/youtube'

export default function TrailerModal({ trailerUrl, onClose }: { trailerUrl: string; onClose: () => void }) {
  const videoId = extractYouTubeId(trailerUrl)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!videoId) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-lg bg-black shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-neutral-900 px-4 py-2">
          <span className="text-sm text-neutral-300">Trailer</span>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 transition hover:rotate-90 hover:bg-neutral-800 hover:text-white active:scale-90"
            aria-label="Close trailer"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="Movie trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="bg-neutral-900 px-4 py-2 text-center">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-300"
          >
            Trailer not playing? Watch on YouTube ↗
          </a>
        </div>
      </div>
    </div>
  )
}
