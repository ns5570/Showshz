import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function TicketQrModal({
  bookingReference,
  title,
  onClose,
}: {
  bookingReference: string
  title: string
  onClose: () => void
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(bookingReference, { width: 240, margin: 1 }).then((url) => {
      if (!cancelled) setQrDataUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [bookingReference])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs overflow-hidden rounded-lg bg-neutral-900 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
          <span className="text-sm text-neutral-300">Your ticket</span>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label="Close ticket"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <p className="text-center text-sm font-medium text-neutral-200">{title}</p>
          <div className="flex h-60 w-60 items-center justify-center rounded-md bg-white p-3">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR code for booking ${bookingReference}`} className="h-full w-full" />
            ) : (
              <div className="h-full w-full animate-pulse rounded bg-neutral-200" />
            )}
          </div>
          <p className="text-center font-mono text-sm tracking-wide text-neutral-100">{bookingReference}</p>
          <p className="text-center text-xs text-neutral-500">Show this at the venue entrance</p>
        </div>
      </div>
    </div>
  )
}
