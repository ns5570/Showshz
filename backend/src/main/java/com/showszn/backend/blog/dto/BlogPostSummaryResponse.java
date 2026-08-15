package com.showszn.backend.blog.dto;

import com.showszn.backend.blog.BlogPost;
import java.time.Instant;

public record BlogPostSummaryResponse(
        Long id, String title, String slug, String category, String excerpt, String imageUrl, Instant publishedAt) {

    public static BlogPostSummaryResponse from(BlogPost post) {
        return new BlogPostSummaryResponse(
                post.getId(), post.getTitle(), post.getSlug(), post.getCategory(), post.getExcerpt(), post.getImageUrl(), post.getPublishedAt());
    }
}
