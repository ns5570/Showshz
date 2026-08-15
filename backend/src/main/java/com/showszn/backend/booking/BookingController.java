package com.showszn.backend.booking;

import com.showszn.backend.booking.dto.BookingResponse;
import com.showszn.backend.booking.dto.ConfirmRequest;
import com.showszn.backend.booking.dto.FeedbackRequest;
import com.showszn.backend.booking.dto.HoldRequest;
import com.showszn.backend.booking.dto.HoldResponse;
import com.showszn.backend.user.UserSyncService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserSyncService userSyncService;

    public BookingController(BookingService bookingService, UserSyncService userSyncService) {
        this.bookingService = bookingService;
        this.userSyncService = userSyncService;
    }

    @PostMapping("/hold")
    public HoldResponse hold(JwtAuthenticationToken authentication, @Valid @RequestBody HoldRequest request) {
        String clerkUserId = clerkUserId(authentication);
        return bookingService.hold(clerkUserId, request.showId(), request.showSeatIds());
    }

    @PostMapping("/confirm")
    public BookingResponse confirm(JwtAuthenticationToken authentication, @Valid @RequestBody ConfirmRequest request) {
        Jwt jwt = authentication.getToken();
        userSyncService.syncFromJwt(jwt);
        return bookingService.confirm(jwt.getSubject(), request.holdId());
    }

    @GetMapping("/{bookingReference}")
    public BookingResponse getByReference(JwtAuthenticationToken authentication, @PathVariable String bookingReference) {
        return bookingService.getByReference(bookingReference, clerkUserId(authentication));
    }

    @GetMapping
    public List<BookingResponse> listMine(JwtAuthenticationToken authentication) {
        return bookingService.listForUser(clerkUserId(authentication));
    }

    @PostMapping("/{bookingId}/feedback")
    public BookingResponse submitFeedback(
            JwtAuthenticationToken authentication, @PathVariable Long bookingId, @Valid @RequestBody FeedbackRequest request) {
        return bookingService.submitFeedback(clerkUserId(authentication), bookingId, request);
    }

    private String clerkUserId(JwtAuthenticationToken authentication) {
        return authentication.getToken().getSubject();
    }
}
