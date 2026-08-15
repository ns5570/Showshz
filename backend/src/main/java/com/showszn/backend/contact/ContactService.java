package com.showszn.backend.contact;

import com.showszn.backend.booking.ResendEmailClient;
import com.showszn.backend.contact.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ResendEmailClient resendEmailClient;
    private final String fromAddress;
    private final String contactEmail;

    public ContactService(
            ResendEmailClient resendEmailClient,
            @Value("${app.resend.from-address:ShowSzn <onboarding@resend.dev>}") String fromAddress,
            @Value("${app.contact-email}") String contactEmail) {
        this.resendEmailClient = resendEmailClient;
        this.fromAddress = fromAddress;
        this.contactEmail = contactEmail;
    }

    public void submit(ContactRequest request) {
        if (!resendEmailClient.isConfigured()) {
            log.info("Skipping contact form email because RESEND_API_KEY is not configured.");
            return;
        }

        String subject = "ShowSzn feedback from " + (request.name() != null && !request.name().isBlank() ? request.name() : "a visitor");
        String textBody = "Name: " + (request.name() != null ? request.name() : "-") + "\n"
                + "Email: " + (request.email() != null ? request.email() : "-") + "\n\n"
                + request.message();

        try {
            resendEmailClient.send(fromAddress, contactEmail, request.email(), subject, textBody);
        } catch (Exception ex) {
            log.warn("Failed to send contact form email", ex);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Could not send your message right now. Please try again later.");
        }
    }
}
