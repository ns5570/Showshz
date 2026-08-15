package com.showszn.backend.catalog.dto;

import com.showszn.backend.catalog.Genre;
import com.showszn.backend.catalog.Language;
import com.showszn.backend.catalog.Movie;
import java.util.List;

public record MovieSummaryResponse(
        Long id,
        String title,
        String slug,
        String posterUrl,
        List<Language> languages,
        List<Genre> genres,
        Integer durationMinutes,
        String censorRating) {

    public static MovieSummaryResponse from(Movie movie) {
        return new MovieSummaryResponse(
                movie.getId(),
                movie.getTitle(),
                movie.getSlug(),
                movie.getPosterUrl(),
                List.copyOf(movie.getLanguages()),
                List.copyOf(movie.getGenres()),
                movie.getDurationMinutes(),
                movie.getCensorRating());
    }
}
