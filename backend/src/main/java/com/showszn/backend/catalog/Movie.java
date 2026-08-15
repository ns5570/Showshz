package com.showszn.backend.catalog;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "movie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_language", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "language", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<Language> languages = new LinkedHashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_genre", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<Genre> genres = new LinkedHashSet<>();

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "poster_url", columnDefinition = "text")
    private String posterUrl;

    @Column(name = "censor_rating")
    private String censorRating;

    @Column(name = "trailer_url", columnDefinition = "text")
    private String trailerUrl;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
