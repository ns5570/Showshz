package com.showszn.backend.booking.dto;

import jakarta.validation.constraints.NotBlank;

public record ConfirmRequest(@NotBlank String holdId) {}
