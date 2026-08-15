package com.showszn.backend.admin.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record MovieWithShowsRequest(
        @Valid @NotNull MovieRequest movie,
        @NotEmpty List<Long> screenIds,
        @NotEmpty List<Instant> startTimes,
        @NotNull @Positive BigDecimal basePrice) {}
