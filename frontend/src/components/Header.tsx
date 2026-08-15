import { Link, NavLink } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import Logo from './Logo'
import CitySelector from './CitySelector'
import SearchBar from './SearchBar'
import { useMe } from '../lib/queries'

const CATEGORIES = [
  { label: 'Movies', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Plays', to: '/plays' },
  { label: 'Sports', to: '/sports' },
  { label: 'Activities', to: '/activities' },
]

export default function Header() {
  const { isSignedIn } = useAuth()
  const { data: me } = useMe(Boolean(isSignedIn))

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden gap-1 md:flex">
              {CATEGORIES.map((cat) => (
                <NavLink
                  key={cat.to}
                  to={cat.to}
                  end={cat.to === '/'}
                  className={({ isActive }) =>
                    `underline-grow rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-90 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 text-white shadow-md shadow-fuchsia-600/30'
                        : 'text-neutral-400 hover:scale-105 hover:text-neutral-200'
                    }`
                  }
                >
                  {cat.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden flex-1 justify-center lg:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <CitySelector />
            {me?.isAdmin && (
              <Link
                to="/admin"
                className="hidden rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:border-red-500 hover:text-red-400 sm:block"
              >
                Admin
              </Link>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="shine-hover hover-wiggle animate-glow-pulse rounded-full bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 px-4 py-2 text-sm font-semibold transition hover:scale-[1.05] hover:brightness-110 active:scale-90">
                  Sign in ✨
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                to="/my-orders"
                className="hidden rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-neutral-100 sm:block"
              >
                My Orders
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="border-t border-neutral-900 px-6 py-3 lg:hidden">
          <SearchBar />
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-neutral-900 px-6 py-2 md:hidden">
          {CATEGORIES.map((cat) => (
            <NavLink
              key={cat.to}
              to={cat.to}
              end={cat.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition active:scale-90 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`
              }
            >
              {cat.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  )
}
