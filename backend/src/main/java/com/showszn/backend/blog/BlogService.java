package com.showszn.backend.blog;

import com.showszn.backend.blog.dto.BlogPostDetailResponse;
import com.showszn.backend.blog.dto.BlogPostSummaryResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public BlogService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPostSummaryResponse> listPosts(String category) {
        List<BlogPost> posts = category != null
                ? blogPostRepository.findByCategoryOrderByPublishedAtDesc(category)
                : blogPostRepository.findAllByOrderByPublishedAtDesc();
        return posts.stream().map(BlogPostSummaryResponse::from).toList();
    }

    public BlogPostDetailResponse getPost(String slug) {
        return blogPostRepository.findBySlug(slug)
                .map(BlogPostDetailResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog post not found: " + slug));
    }
}
