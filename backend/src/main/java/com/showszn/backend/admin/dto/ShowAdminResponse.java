package com.showszn.backend.admin.dto;

import com.showszn.backend.catalog.Show;
import java.math.BigDecimal;
import java.time.Instant;

public record ShowAdminResponse(
        Long id,
        Long movieId,
        String movieTitle,
        Long screenId,
        String screenName,
        Long venueId,
        String venueName,
        Instant startTime,
        Instant endTime,
        BigDecimal basePrice) {

    public static ShowAdminResponse from(Show show) {
        return new ShowAdminResponse(
                show.getId(),
                show.getMovie().getId(),
                show.getMovie().getTitle(),
                show.getScreen().getId(),
                show.getScreen().getName(),
                show.getScreen().getVenue().getId(),
                show.getScreen().getVenue().getName(),
                show.getStartTime(),
                show.getEndTime(),
                show.getBasePrice());
    }
}
