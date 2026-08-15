package com.showszn.backend.booking.dto;

import com.showszn.backend.booking.Booking;
import com.showszn.backend.booking.BookingFeedback;
import com.showszn.backend.booking.BookingSeat;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record BookingResponse(
        Long id,
        String bookingReference,
        String status,
        String movieTitle,
        String venueName,
        String screenName,
        Instant startTime,
        BigDecimal totalAmount,
        List<SeatSummary> seats,
        Instant createdAt,
        FeedbackSummary feedback) {

    public record SeatSummary(String rowLabel, Integer seatNumber, String seatType, BigDecimal price) {}

    public record FeedbackSummary(Integer rating, String comment) {
        public static FeedbackSummary from(BookingFeedback feedback) {
            return new FeedbackSummary(feedback.getRating(), feedback.getComment());
        }
    }

    public static BookingResponse from(Booking booking, List<BookingSeat> bookingSeats, BookingFeedback feedback) {
        List<SeatSummary> seats = bookingSeats.stream()
                .map(bs -> new SeatSummary(
                        bs.getShowSeat().getSeat().getRowLabel(),
                        bs.getShowSeat().getSeat().getSeatNumber(),
                        bs.getShowSeat().getSeat().getSeatType().name(),
                        bs.getPrice()))
                .toList();

        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getStatus().name(),
                booking.getShow().getMovie().getTitle(),
                booking.getShow().getScreen().getVenue().getName(),
                booking.getShow().getScreen().getName(),
                booking.getShow().getStartTime(),
                booking.getTotalAmount(),
                seats,
                booking.getCreatedAt(),
                feedback != null ? FeedbackSummary.from(feedback) : null);
    }
}
