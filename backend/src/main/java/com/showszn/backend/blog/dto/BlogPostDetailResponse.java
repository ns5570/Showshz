package com.showszn.backend.blog.dto;

import com.showszn.backend.blog.BlogPost;
import java.time.Instant;

public record BlogPostDetailResponse(
        Long id,
        String title,
        String slug,
        String category,
        String excerpt,
        String content,
        String imageUrl,
        Instant publishedAt) {

    public static BlogPostDetailResponse from(BlogPost post) {
        return new BlogPostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getSlug(),
                post.getCategory(),
                post.getExcerpt(),
                post.getContent(),
                post.getImageUrl(),
                post.getPublishedAt());
    }
}
