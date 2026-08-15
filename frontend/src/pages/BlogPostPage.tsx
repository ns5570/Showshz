import { Link, useParams } from 'react-router-dom'
import { useBlogPost } from '../lib/blogQueries'
import { formatShowDate } from '../lib/date'
import Footer from '../components/Footer'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading } = useBlogPost(slug ?? '')

  if (isLoading || !post) {
    return (
      <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
        <p className="text-neutral-400">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
        <Link to="/" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Back
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {post.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
            <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <p className="mt-6 text-xs uppercase tracking-wide text-neutral-500">
          {post.category} · {formatShowDate(post.publishedAt)}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{post.title}</h1>
        <p className="mt-3 text-neutral-400">{post.excerpt}</p>

        <div className="mt-6 whitespace-pre-line leading-relaxed text-neutral-200">{post.content}</div>
      </main>

      <Footer />
    </div>
  )
}
