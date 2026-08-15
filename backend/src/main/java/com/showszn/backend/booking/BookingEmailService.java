package com.showszn.backend.booking;

import com.showszn.backend.booking.dto.BookingResponse;
import com.showszn.backend.user.AppUser;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends the booking confirmation email off the request thread. Mail delivery is out of
 * this app's control (DNS/network/provider hiccups can make a single send take a long
 * time, or hang), so it must never sit inside the same call that confirms a booking --
 * that would make a slow or unreachable mail provider look like a broken booking flow.
 *
 * Sends via Resend's HTTPS API rather than SMTP: Railway (and most PaaS free/hobby tiers)
 * blocks outbound SMTP to prevent spam, so a raw SMTP connection to Gmail never completes
 * there -- an HTTPS API call isn't affected.
 */
@Service
public class BookingEmailService {

    private static final Logger log = LoggerFactory.getLogger(BookingEmailService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEE, d MMM yyyy 'at' h:mm a", Locale.ENGLISH);

    private final ResendEmailClient resendEmailClient;
    private final TicketPdfGenerator ticketPdfGenerator;
    private final String fromAddress;

    public BookingEmailService(
            ResendEmailClient resendEmailClient,
            TicketPdfGenerator ticketPdfGenerator,
            @Value("${app.resend.from-address:ShowSzn <onboarding@resend.dev>}") String fromAddress) {
        this.resendEmailClient = resendEmailClient;
        this.ticketPdfGenerator = ticketPdfGenerator;
        this.fromAddress = fromAddress;
    }

    @Async("mailTaskExecutor")
    public void sendConfirmation(AppUser user, BookingResponse booking) {
        sendConfirmation(
                user,
                booking.bookingReference(),
                booking.movieTitle(),
                booking.venueName(),
                booking.screenName(),
                booking.startTime(),
                booking.totalAmount(),
                booking.seats().stream()
                        .map(seat -> seat.rowLabel() + seat.seatNumber())
                        .toList());
    }

    @Async("mailTaskExecutor")
    public void sendConfirmation(
            AppUser user,
            String bookingReference,
            String title,
            String venueName,
            String screenName,
            Instant startTime,
            BigDecimal totalAmount,
            List<String> seats) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            log.info("Skipping booking confirmation email because the user does not have an email address.");
            return;
        }
        if (!resendEmailClient.isConfigured()) {
            log.info("Skipping booking confirmation email because RESEND_API_KEY is not configured.");
            return;
        }

        String seatList = String.join(", ", seats.isEmpty() ? List.of("N/A") : seats);
        String formattedDate = startTime.atZone(ZoneId.systemDefault()).format(DATE_FORMAT);

        try {
            byte[] ticketPdf = ticketPdfGenerator.generate(bookingReference, title, venueName, screenName, startTime, totalAmount, seats);

            String textBody = "Hello " + (user.getName() != null ? user.getName() : "there") + ",\n\n"
                    + "Your booking has been confirmed successfully.\n\n"
                    + "Booking Reference: " + bookingReference + "\n"
                    + "Event / Show: " + title + "\n"
                    + "Venue: " + venueName + " - " + screenName + "\n"
                    + "Timing: " + formattedDate + "\n"
                    + "Seat(s): " + seatList + "\n"
                    + "Total paid: ₹" + totalAmount + "\n\n"
                    + "Your e-ticket is attached as a PDF -- show its QR code at the venue entrance.\n\n"
                    + "Thank you for booking with ShowSzn. We look forward to seeing you!";

            resendEmailClient.sendWithAttachment(
                    fromAddress,
                    user.getEmail(),
                    "Booking confirmed: " + title,
                    textBody,
                    "ShowSzn-Ticket-" + bookingReference + ".pdf",
                    ticketPdf);
            log.info("Booking confirmation email with ticket PDF sent to {} for booking {}", user.getEmail(), bookingReference);
        } catch (Exception ex) {
            log.warn("Failed to send booking confirmation email to {} for booking {}", user.getEmail(), bookingReference, ex);
        }
    }
}
