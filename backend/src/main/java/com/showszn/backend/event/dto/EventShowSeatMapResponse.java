package com.showszn.backend.event.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record EventShowSeatMapResponse(
        Long eventShowId,
        String eventTitle,
        String venueName,
        String screenName,
        Instant startTime,
        List<SeatEntry> seats) {

    public record SeatEntry(
            Long eventShowSeatId, String rowLabel, Integer seatNumber, String seatType, BigDecimal price, String status) {}
}
