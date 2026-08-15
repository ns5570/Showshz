package com.showszn.backend.catalog.dto;

import com.showszn.backend.catalog.Genre;
import com.showszn.backend.catalog.Language;
import com.showszn.backend.catalog.Movie;
import java.time.LocalDate;
import java.util.List;

public record MovieDetailResponse(
        Long id,
        String title,
        String slug,
        String description,
        String posterUrl,
        List<Language> languages,
        List<Genre> genres,
        Integer durationMinutes,
        String censorRating,
        String trailerUrl,
        LocalDate releaseDate) {

    public static MovieDetailResponse from(Movie movie) {
        return new MovieDetailResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getSlug(),
                movie.getDescription(),
                movie.getPosterUrl(),
                List.copyOf(movie.getLanguages()),
                List.copyOf(movie.getGenres()),
                movie.getDurationMinutes(),
                movie.getCensorRating(),
                movie.getTrailerUrl(),
                movie.getReleaseDate());
    }
}
