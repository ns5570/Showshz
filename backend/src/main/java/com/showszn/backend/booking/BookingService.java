package com.showszn.backend.booking;

import com.showszn.backend.booking.dto.BookingResponse;
import com.showszn.backend.booking.dto.FeedbackRequest;
import com.showszn.backend.booking.dto.HoldResponse;
import com.showszn.backend.catalog.Show;
import com.showszn.backend.catalog.ShowRepository;
import com.showszn.backend.catalog.ShowSeat;
import com.showszn.backend.catalog.ShowSeatRepository;
import com.showszn.backend.catalog.ShowSeatStatus;
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
public class BookingService {

    private static final String NAMESPACE = "movie";

    private final SeatLockService seatLockService;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingFeedbackRepository bookingFeedbackRepository;
    private final AppUserRepository appUserRepository;
    private final BookingEmailService bookingEmailService;

    public BookingService(
            SeatLockService seatLockService,
            ShowRepository showRepository,
            ShowSeatRepository showSeatRepository,
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            BookingFeedbackRepository bookingFeedbackRepository,
            AppUserRepository appUserRepository,
            BookingEmailService bookingEmailService) {
        this.seatLockService = seatLockService;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.bookingFeedbackRepository = bookingFeedbackRepository;
        this.appUserRepository = appUserRepository;
        this.bookingEmailService = bookingEmailService;
    }

    @Transactional(readOnly = true)
    public HoldResponse hold(String clerkUserId, Long showId, List<Long> showSeatIds) {
        List<ShowSeat> seats = showSeatRepository.findByIdsWithSeatAndShow(showSeatIds);
        if (seats.size() != showSeatIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more seats not found");
        }
        for (ShowSeat seat : seats) {
            if (!seat.getShow().getId().equals(showId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat does not belong to this show");
            }
            if (seat.getStatus() == ShowSeatStatus.BOOKED) {
                throw new SeatConflictException("Seat " + seat.getId() + " is already booked");
            }
        }
        if (!seats.isEmpty() && seats.get(0).getShow().getStartTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This show has already started and can no longer be booked");
        }

        BigDecimal total = seats.stream().map(ShowSeat::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        SeatLockService.HoldResult result = seatLockService.createHold(NAMESPACE, clerkUserId, showId, showSeatIds, total);
        return new HoldResponse(result.holdId(), result.expiresAt(), total, seats.size());
    }

    @Transactional
    public BookingResponse confirm(String clerkUserId, String holdId) {
        HoldPayload payload = seatLockService.consumeHold(NAMESPACE, holdId, clerkUserId);

        AppUser user = appUserRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        Show show = showRepository.findByIdWithDetails(payload.showId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Show not found"));
        if (show.getStartTime().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This show has already started and can no longer be booked");
        }
        List<ShowSeat> seats = showSeatRepository.findByIdsWithSeatAndShow(payload.showSeatIds());

        for (ShowSeat seat : seats) {
            if (seat.getStatus() == ShowSeatStatus.BOOKED) {
                throw new SeatConflictException("Seat " + seat.getId() + " was just booked by someone else");
            }
        }

        Booking booking = Booking.builder()
                .bookingReference(generateReference())
                .user(user)
                .show(show)
                .status(BookingStatus.CONFIRMED)
                .totalAmount(payload.totalAmount())
                .createdAt(Instant.now())
                .build();
        booking = bookingRepository.save(booking);

        for (ShowSeat seat : seats) {
            seat.setStatus(ShowSeatStatus.BOOKED);
            showSeatRepository.save(seat);
            bookingSeatRepository.save(BookingSeat.builder()
                    .booking(booking)
                    .showSeat(seat)
                    .price(seat.getPrice())
                    .build());
        }

        seatLockService.releaseHold(NAMESPACE, holdId, payload.showSeatIds());

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        BookingResponse response = BookingResponse.from(booking, bookingSeats, null);
        bookingEmailService.sendConfirmation(user, response);
        return response;
    }

    @Transactional(readOnly = true)
    public BookingResponse getByReference(String bookingReference, String clerkUserId) {
        Booking booking = requireOwnedBooking(bookingReference, clerkUserId);
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        BookingFeedback feedback = bookingFeedbackRepository.findByBookingId(booking.getId()).orElse(null);
        return BookingResponse.from(booking, bookingSeats, feedback);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> listForUser(String clerkUserId) {
        List<Booking> bookings = bookingRepository.findByUserClerkIdWithDetails(clerkUserId);
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        Map<Long, BookingFeedback> feedbackByBookingId = bookingFeedbackRepository.findByBookingIdIn(bookingIds).stream()
                .collect(Collectors.toMap(f -> f.getBooking().getId(), f -> f));

        return bookings.stream()
                .map(b -> BookingResponse.from(
                        b, bookingSeatRepository.findByBookingIdWithSeat(b.getId()), feedbackByBookingId.get(b.getId())))
                .toList();
    }

    @Transactional
    public BookingResponse submitFeedback(String clerkUserId, Long bookingId, FeedbackRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getClerkUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking does not belong to you");
        }
        if (booking.getShow().getStartTime().isAfter(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Feedback is available once the show has taken place");
        }

        BookingFeedback feedback = bookingFeedbackRepository.findByBookingId(bookingId)
                .orElseGet(() -> BookingFeedback.builder().booking(booking).createdAt(Instant.now()).build());
        feedback.setRating(request.rating());
        feedback.setComment(request.comment());
        feedback.setUpdatedAt(Instant.now());
        bookingFeedbackRepository.save(feedback);

        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingIdWithSeat(booking.getId());
        return BookingResponse.from(booking, bookingSeats, feedback);
    }

    private Booking requireOwnedBooking(String bookingReference, String clerkUserId) {
        Booking booking = bookingRepository.findByBookingReferenceWithDetails(bookingReference)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!booking.getUser().getClerkUserId().equals(clerkUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking does not belong to you");
        }
        return booking;
    }

    private String generateReference() {
        return "SZ" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }
}
