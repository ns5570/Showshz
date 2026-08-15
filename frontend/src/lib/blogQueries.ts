import { useQuery } from '@tanstack/react-query'
import { api } from './api'
import type { BlogPostDetail, BlogPostSummary } from '../types'

export function useBlogPosts(category?: string) {
  return useQuery({
    queryKey: ['blog-posts', category],
    queryFn: async () => (await api.get<BlogPostSummary[]>('/public/blog', { params: { category } })).data,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => (await api.get<BlogPostDetail>(`/public/blog/${slug}`)).data,
  })
}
