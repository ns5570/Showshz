package com.showszn.backend.admin.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.Instant;

public record ShowRequest(
        @NotNull Long movieId,
        @NotNull Long screenId,
        @NotNull Instant startTime,
        @NotNull @Positive BigDecimal basePrice) {}
