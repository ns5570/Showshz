package com.showszn.backend.eventbooking.dto;

import com.showszn.backend.eventbooking.EventBooking;
import com.showszn.backend.eventbooking.EventBookingFeedback;
import com.showszn.backend.eventbooking.EventBookingSeat;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record EventBookingResponse(
        Long id,
        String bookingReference,
        String status,
        String eventTitle,
        String venueName,
        String screenName,
        Instant startTime,
        BigDecimal totalAmount,
        List<SeatSummary> seats,
        Instant createdAt,
        FeedbackSummary feedback) {

    public record SeatSummary(String rowLabel, Integer seatNumber, String seatType, BigDecimal price) {}

    public record FeedbackSummary(Integer rating, String comment) {
        public static FeedbackSummary from(EventBookingFeedback feedback) {
            return new FeedbackSummary(feedback.getRating(), feedback.getComment());
        }
    }

    public static EventBookingResponse from(
            EventBooking booking, List<EventBookingSeat> bookingSeats, EventBookingFeedback feedback) {
        List<SeatSummary> seats = bookingSeats.stream()
                .map(bs -> new SeatSummary(
                        bs.getEventShowSeat().getSeat().getRowLabel(),
                        bs.getEventShowSeat().getSeat().getSeatNumber(),
                        bs.getEventShowSeat().getSeat().getSeatType().name(),
                        bs.getPrice()))
                .toList();

        return new EventBookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getStatus().name(),
                booking.getEventShow().getEvent().getTitle(),
                booking.getEventShow().getScreen().getVenue().getName(),
                booking.getEventShow().getScreen().getName(),
                booking.getEventShow().getStartTime(),
                booking.getTotalAmount(),
                seats,
                booking.getCreatedAt(),
                feedback != null ? FeedbackSummary.from(feedback) : null);
    }
}
