package com.showszn.backend.catalog.dto;

import com.showszn.backend.catalog.Show;
import java.math.BigDecimal;
import java.time.Instant;

public record ShowResponse(
        Long id,
        Long venueId,
        String venueName,
        Long screenId,
        String screenName,
        Instant startTime,
        Instant endTime,
        BigDecimal basePrice) {

    public static ShowResponse from(Show show) {
        return new ShowResponse(
                show.getId(),
                show.getScreen().getVenue().getId(),
                show.getScreen().getVenue().getName(),
                show.getScreen().getId(),
                show.getScreen().getName(),
                show.getStartTime(),
                show.getEndTime(),
                show.getBasePrice());
    }
}
