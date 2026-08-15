package com.showszn.backend.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ShowSeatMapResponse(
        Long showId,
        String movieTitle,
        String venueName,
        String screenName,
        Instant startTime,
        List<SeatEntry> seats) {

    public record SeatEntry(
            Long showSeatId, String rowLabel, Integer seatNumber, String seatType, BigDecimal price, String status) {}
}
