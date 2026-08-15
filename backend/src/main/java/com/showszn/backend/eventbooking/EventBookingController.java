package com.showszn.backend.eventbooking;

import com.showszn.backend.booking.dto.ConfirmRequest;
import com.showszn.backend.booking.dto.FeedbackRequest;
import com.showszn.backend.booking.dto.HoldRequest;
import com.showszn.backend.booking.dto.HoldResponse;
import com.showszn.backend.eventbooking.dto.EventBookingResponse;
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
@RequestMapping("/api/event-bookings")
public class EventBookingController {

    private final EventBookingService eventBookingService;
    private final UserSyncService userSyncService;

    public EventBookingController(EventBookingService eventBookingService, UserSyncService userSyncService) {
        this.eventBookingService = eventBookingService;
        this.userSyncService = userSyncService;
    }

    @PostMapping("/hold")
    public HoldResponse hold(JwtAuthenticationToken authentication, @Valid @RequestBody HoldRequest request) {
        String clerkUserId = clerkUserId(authentication);
        return eventBookingService.hold(clerkUserId, request.showId(), request.showSeatIds());
    }

    @PostMapping("/confirm")
    public EventBookingResponse confirm(JwtAuthenticationToken authentication, @Valid @RequestBody ConfirmRequest request) {
        Jwt jwt = authentication.getToken();
        userSyncService.syncFromJwt(jwt);
        return eventBookingService.confirm(jwt.getSubject(), request.holdId());
    }

    @GetMapping("/{bookingReference}")
    public EventBookingResponse getByReference(JwtAuthenticationToken authentication, @PathVariable String bookingReference) {
        return eventBookingService.getByReference(bookingReference, clerkUserId(authentication));
    }

    @GetMapping
    public List<EventBookingResponse> listMine(JwtAuthenticationToken authentication) {
        return eventBookingService.listForUser(clerkUserId(authentication));
    }

    @PostMapping("/{bookingId}/feedback")
    public EventBookingResponse submitFeedback(
            JwtAuthenticationToken authentication, @PathVariable Long bookingId, @Valid @RequestBody FeedbackRequest request) {
        return eventBookingService.submitFeedback(clerkUserId(authentication), bookingId, request);
    }

    private String clerkUserId(JwtAuthenticationToken authentication) {
        return authentication.getToken().getSubject();
    }
}
