package com.showszn.backend.blog;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    List<BlogPost> findByCategoryOrderByPublishedAtDesc(String category);

    List<BlogPost> findAllByOrderByPublishedAtDesc();
}
