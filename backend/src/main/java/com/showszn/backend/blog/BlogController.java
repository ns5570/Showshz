package com.showszn.backend.blog;

import com.showszn.backend.blog.dto.BlogPostDetailResponse;
import com.showszn.backend.blog.dto.BlogPostSummaryResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/blog")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<BlogPostSummaryResponse> list(@RequestParam(required = false) String category) {
        return blogService.listPosts(category);
    }

    @GetMapping("/{slug}")
    public BlogPostDetailResponse post(@PathVariable String slug) {
        return blogService.getPost(slug);
    }
}
