package com.showszn.backend.admin.dto;

import com.showszn.backend.catalog.Genre;
import com.showszn.backend.catalog.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.Set;

public record MovieRequest(
        @NotBlank String title,
        @NotBlank String slug,
        String description,
        @NotNull @Positive Integer durationMinutes,
        @NotEmpty Set<Language> languages,
        @NotEmpty Set<Genre> genres,
        @NotNull LocalDate releaseDate,
        String posterUrl,
        String censorRating,
        String trailerUrl) {}
