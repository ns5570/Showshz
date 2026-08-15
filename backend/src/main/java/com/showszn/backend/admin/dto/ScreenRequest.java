package com.showszn.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record ScreenRequest(@NotBlank String name) {}
