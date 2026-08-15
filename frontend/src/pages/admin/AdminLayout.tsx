import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useMe } from '../../lib/queries'

const TABS = [
  { to: '/admin/movies', label: 'Movies' },
  { to: '/admin/venues', label: 'Venues' },
  { to: '/admin/screens', label: 'Screens' },
  { to: '/admin/shows', label: 'Shows' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/event-shows', label: 'Event Shows' },
]

export default function AdminLayout() {
  const { isLoaded, isSignedIn } = useAuth()
  const { data: me, isLoading: meLoading } = useMe(Boolean(isSignedIn))

  if (!isLoaded || (isSignedIn && meLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Loading…
      </div>
    )
  }

  if (!isSignedIn || !me?.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-100">
        <p className="text-lg font-medium">Access denied</p>
        <p className="text-sm text-neutral-400">You need admin access to view this page.</p>
        <Link to="/" className="mt-2 text-sm text-red-400 hover:text-red-300">
          ← Back to ShowSzn
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Show<span className="text-red-500">Szn</span> <span className="text-neutral-500">Admin</span>
          </Link>
          <Link to="/" className="text-sm text-neutral-400 hover:text-neutral-200">
            ← Back to site
          </Link>
        </div>
        <nav className="mt-4 flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-red-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="animate-fade-in px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
