package com.showszn.backend.eventbooking;

import com.showszn.backend.booking.BookingEmailService;
import com.showszn.backend.booking.BookingStatus;
import com.showszn.backend.booking.HoldPayload;
import com.showszn.backend.booking.SeatConflictException;
import com.showszn.backend.booking.SeatLockService;
import com.showszn.backend.booking.dto.FeedbackRequest;
import com.showszn.backend.booking.dto.HoldResponse;
import com.showszn.backend.catalog.ShowSeatStatus;
import com.showszn.backend.event.EventShow;
import com.showszn.backend.event.EventShowRepository;
import com.showszn.backend.event.EventShowSeat;
import com.showszn.backend.event.EventShowSeatRepository;
import com.showszn.backend.eventbooking.dto.EventBookingResponse;
import com.showszn.backend.user.AppUser;
import com.showszn.backend.user.AppUserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventBookingService {

    private static final String NAMESPACE = "event";

    private final SeatLockService seatLockService;
    private final EventShowRepository eventShowRepository;
    private final EventShowSeatRepository eventShowSeatRepository;
    private final EventBookingRepository eventBookingRepository;
    private final EventBookingSeatRepository eventBookingSeatRepository;
    private final EventBookingFeedbackRepository eventBookingFeedbackRepository;
    private final AppUserRepository appUserRepository;
    private final BookingEmailService bookingEmailService;

    public EventBookingService(
            SeatLockService seatLockService,
            EventShowRepository eventShowRepository,
            EventShowSeatRepository eventShowSeatRepository,
            EventBookingRepository eventBookingRepository,
            EventBookingSeatRepository eventBookingSeatRepository,
            EventBookingFeedbackRepository eventBookingFeedbackRepository,
            AppUserRepository appUserRepository,
            BookingEmailService bookingEmailService) {
        this.seatLockService = seatLockService;
        this.eventShowRepository = eventShowRepository;
        this.eventShowSeatRepository = eventShowSeatRepository;
        this.eventBookingRepository = eventBookingRepository;
        this.eventBookingSeatRepository = eventBookingSeatRepository;
        this.eventBookingFeedbackRepository = eventBookingFeedbackRepository;
        this.appUserRepository = appUserRepository;
        this.bookingEmailService = bookingEmailService;
    }

    @Transactional(readOnly = true)
    public HoldResponse hold(String clerkUserId, Long eventShowId, List<Long> eventShowSeatIds) {
        List<EventShowSeat> seats = eventShowSeatRepository.findByIdsWithSeatAndShow(eventShowSeatIds);
        if (seats.size() != eventShowSeatIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more seats not found");
        }
        for (EventShowSeat seat : seats) {
            if (!seat.getEventShow().getId().equals(eventShowId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat does not belong to this event show");
            }
            if (seat.getStatus() == ShowSeatStatus.BOOKED) {
                throw new SeatConflictException("Seat " + seat.getId() + " is already booked");
            }
        }
        if (!seats.isEmpty() && seats.get(0).getEventShow().getStartTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This show has already started and can no longer be booked");
        }

        BigDecimal total = seats.stream().map(EventShowSeat::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        SeatLockService.HoldResult result =
                seatLockService.createHold(NAMESPACE, clerkUserId, eventShowId, eventShowSeatIds, total);
        return new HoldResponse(result.holdId(), result.expiresAt(), total, seats.size());
    }

    @Transactional
    public EventBookingResponse confirm(String clerkUserId, String holdId) {
        HoldPayload payload = seatLockService.consumeHold(NAMESPACE, holdId, clerkUserId);

        AppUser user = appUserRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        EventShow eventShow = eventShowRepository.findByIdWithDetails(payload.showId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event show not found"));
        if (eventShow.getStartTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This show has already started and can no longer be booked");
        }
        List<EventShowSeat> seats = eventShowSeatRepository.findByIdsWithSeatAndShow(payload.showSeatIds());

        for (EventShowSeat seat : seats) {
            if (seat.getStatus() == ShowSeatStatus.BOOKED) {
                throw new SeatConflictException("Seat " + seat.getId() + " was just booked by someone else");
            }
        }

        EventBooking booking = EventBooking.builder()
                .bookingReference(generateReference())
                .user(user)
                .eventShow(eventShow)
                .status(BookingStatus.CONFIRMED)
                .totalAmount(payload.totalAmount())
                .createdAt(Instant.now())
                .build();
        booking = eventBookingRepository.save(booking);

        for (EventShowSeat seat : seats) {
            seat.setStatus(ShowSeatStatus.BOOKED);
            eventShowSeatRepository.save(seat);
            eventBookingSeatRepository.save(EventBookingSeat.builder()
                    .eventBooking(booking)
                    .eventShowSeat(seat)
                    .price(seat.getPrice())
                    .build());
        }

        seatLockService.releaseHold(NAMESPACE, holdId, payload.showSeatIds());

        List<EventBookingSeat> bookingSeats = eventBookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        EventBookingResponse response = EventBookingResponse.from(booking, bookingSeats, null);
        bookingEmailService.sendConfirmation(
                user,
                response.bookingReference(),
                response.eventTitle(),
                response.venueName(),
                response.screenName(),
                response.startTime(),
                response.totalAmount(),
                response.seats().stream().map(seat -> seat.rowLabel() + seat.seatNumber()).toList());
        return response;
    }

    @Transactional(readOnly = true)
    public EventBookingResponse getByReference(String bookingReference, String clerkUserId) {
        EventBooking booking = requireOwnedBooking(bookingReference, clerkUserId);
        List<EventBookingSeat> bookingSeats = eventBookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        EventBookingFeedback feedback =
                eventBookingFeedbackRepository.findByEventBookingId(booking.getId()).orElse(null);
        return EventBookingResponse.from(booking, bookingSeats, feedback);
    }

    @Transactional(readOnly = true)
    public List<EventBookingResponse> listForUser(String clerkUserId) {
        List<EventBooking> bookings = eventBookingRepository.findByUserClerkIdWithDetails(clerkUserId);
        List<Long> bookingIds = bookings.stream().map(EventBooking::getId).toList();
        Map<Long, EventBookingFeedback> feedbackByBookingId = eventBookingFeedbackRepository
                .findByEventBookingIdIn(bookingIds).stream()
                .collect(Collectors.toMap(f -> f.getEventBooking().getId(), f -> f));

        return bookings.stream()
                .map(b -> EventBookingResponse.from(
                        b, eventBookingSeatRepository.findByBookingIdWithSeat(b.getId()), feedbackByBookingId.get(b.getId())))
                .toList();
    }

    @Transactional
    public EventBookingResponse submitFeedback(String clerkUserId, Long bookingId, FeedbackRequest request) {
        EventBooking booking = eventBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getClerkUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking does not belong to you");
        }
        if (booking.getEventShow().getStartTime().isAfter(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Feedback is available once the event has taken place");
        }

        EventBookingFeedback feedback = eventBookingFeedbackRepository.findByEventBookingId(bookingId)
                .orElseGet(() -> EventBookingFeedback.builder().eventBooking(booking).createdAt(Instant.now()).build());
        feedback.setRating(request.rating());
        feedback.setComment(request.comment());
        feedback.setUpdatedAt(Instant.now());
        eventBookingFeedbackRepository.save(feedback);

        List<EventBookingSeat> bookingSeats = eventBookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        return EventBookingResponse.from(booking, bookingSeats, feedback);
    }

    private EventBooking requireOwnedBooking(String bookingReference, String clerkUserId) {
        EventBooking booking = eventBookingRepository.findByBookingReferenceWithDetails(bookingReference)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getClerkUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking does not belong to you");
        }
        return booking;
    }

    private String generateReference() {
        return "SE" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }
}
