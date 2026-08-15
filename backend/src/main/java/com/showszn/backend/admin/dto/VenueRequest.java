package com.showszn.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VenueRequest(
        @NotNull Long cityId,
        @NotBlank String name,
        @NotBlank String address,
        @NotBlank String slug) {}
