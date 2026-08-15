import { Link } from 'react-router-dom'
import { useBlogPosts } from '../lib/blogQueries'
import { formatShowDate } from '../lib/date'
import { useReveal } from '../lib/useReveal'
import type { BlogPostSummary } from '../types'

export default function BlogSection({ category, heading }: { category: string; heading: string }) {
  const { data: posts, isLoading } = useBlogPosts(category)

  if (!isLoading && (!posts || posts.length === 0)) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">{heading}</h2>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-lg bg-neutral-900" />
          ))}
        </div>
      )}

      {posts && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogPostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

function BlogPostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  const { ref, className } = useReveal<HTMLAnchorElement>()

  return (
    <Link
      ref={ref}
      to={`/blog/${post.slug}`}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={`${className} hover-tilt overflow-hidden rounded-lg bg-neutral-900 shadow-md shadow-black/20 transition duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95`}
    >
      {post.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-neutral-800">
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-neutral-500">{formatShowDate(post.publishedAt)}</p>
        <h3 className="mt-1 font-medium">{post.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{post.excerpt}</p>
      </div>
    </Link>
  )
}
