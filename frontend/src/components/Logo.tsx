import { Link } from 'react-router-dom'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="7" width="28" height="18" rx="3" fill="#dc2626" />
        <path
          d="M2 10.5h28M8 7v3.5M8 21.5V25M14 7v3.5M14 21.5V25M20 7v3.5M20 21.5V25M26 7v3.5M26 21.5V25"
          stroke="#0a0a0a"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="4" fill="#0a0a0a" />
        <path d="M14.5 14.2v3.6l3.2-1.8-3.2-1.8Z" fill="#dc2626" />
      </svg>
      <span className="relative font-display text-xl font-bold tracking-tight text-neutral-100">
        Show<span className="text-gradient">Szn</span>
        <span className="sparkle-on-hover absolute -right-3 -top-1 text-xs">✨</span>
      </span>
    </Link>
  )
}
