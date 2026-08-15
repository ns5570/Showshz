package com.showszn.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record EventRequest(
        @NotBlank String title,
        @NotBlank String slug,
        @NotBlank String category,
        String description,
        String imageUrl,
        Integer durationMinutes) {}
