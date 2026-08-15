package com.showszn.backend.event.dto;

import com.showszn.backend.event.EventShow;
import java.math.BigDecimal;
import java.time.Instant;

public record EventShowResponse(
        Long id,
        Long venueId,
        String venueName,
        Long screenId,
        String screenName,
        Instant startTime,
        Instant endTime,
        BigDecimal basePrice) {

    public static EventShowResponse from(EventShow eventShow) {
        return new EventShowResponse(
                eventShow.getId(),
                eventShow.getScreen().getVenue().getId(),
                eventShow.getScreen().getVenue().getName(),
                eventShow.getScreen().getId(),
                eventShow.getScreen().getName(),
                eventShow.getStartTime(),
                eventShow.getEndTime(),
                eventShow.getBasePrice());
    }
}
