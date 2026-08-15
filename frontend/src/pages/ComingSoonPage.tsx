import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ComingSoonPage({
  title,
  description,
  emoji,
}: {
  title: string
  description: string
  emoji: string
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="text-5xl">{emoji}</span>
        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-sm text-neutral-400">{description}</p>
        <p className="mt-6 text-sm text-neutral-600">Coming soon to ShowSzn.</p>
      </main>
      <Footer />
    </div>
  )
}
