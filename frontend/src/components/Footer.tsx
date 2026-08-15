import { Link } from 'react-router-dom'
import Logo from './Logo'
import FeedbackForm from './FeedbackForm'

const EXPLORE_LINKS = [
  { label: 'Movies', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Plays', to: '/plays' },
  { label: 'Sports', to: '/sports' },
  { label: 'Activities', to: '/activities' },
]

const SOCIALS: { label: string; path: string }[] = [
  { label: 'X', path: 'M4 4l16 16M20 4L4 20' },
  { label: 'Instagram', path: 'M4 4h16v16H4z' },
  { label: 'YouTube', path: 'M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z' },
]

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 bg-gradient-to-b from-red-600/[0.04] via-fuchsia-700/[0.02] to-transparent px-6 py-12 text-neutral-400">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Logo />
          <p className="mt-3 text-sm text-neutral-500">
            Book movies, events, plays, sports and activities near you.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="hover-wiggle flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 text-neutral-500 transition duration-200 hover:scale-110 hover:border-red-500 hover:text-red-400 active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Explore">
          {EXPLORE_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="underline-grow -mx-2 w-fit px-2 transition hover:text-red-400 hover:translate-x-0.5">
              {link.label}
            </Link>
          ))}
        </FooterColumn>

        <div className="col-span-2">
          <FeedbackForm />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-neutral-900 pt-6 text-xs text-neutral-600">
        © {new Date().getFullYear()} ShowSzn. All rights reserved.
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-neutral-200">{title}</h3>
      <div className="flex flex-col gap-2 text-sm">{children}</div>
    </div>
  )
}
