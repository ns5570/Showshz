package com.showszn.backend.admin.dto;

import com.showszn.backend.event.EventShow;
import java.math.BigDecimal;
import java.time.Instant;

public record EventShowAdminResponse(
        Long id,
        Long eventId,
        String eventTitle,
        Long screenId,
        String screenName,
        Long venueId,
        String venueName,
        Instant startTime,
        Instant endTime,
        BigDecimal basePrice) {

    public static EventShowAdminResponse from(EventShow eventShow) {
        return new EventShowAdminResponse(
                eventShow.getId(),
                eventShow.getEvent().getId(),
                eventShow.getEvent().getTitle(),
                eventShow.getScreen().getId(),
                eventShow.getScreen().getName(),
                eventShow.getScreen().getVenue().getId(),
                eventShow.getScreen().getVenue().getName(),
                eventShow.getStartTime(),
                eventShow.getEndTime(),
                eventShow.getBasePrice());
    }
}
