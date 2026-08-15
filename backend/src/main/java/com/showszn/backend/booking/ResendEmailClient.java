package com.showszn.backend.booking;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Sends mail via Resend's HTTPS API instead of raw SMTP. Railway (and most PaaS free/hobby
 * tiers) blocks outbound SMTP entirely to prevent spam, so a JavaMailSender pointed at Gmail
 * never connects there -- an HTTPS API call goes through the same path as any other outbound
 * request and isn't affected.
 */
@Component
public class ResendEmailClient {

    private final RestClient restClient;
    private final String apiKey;

    public ResendEmailClient(@Value("${app.resend.api-key:}") String apiKey) {
        this.apiKey = apiKey;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(5000);

        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public void send(String from, String to, String replyTo, String subject, String textBody) {
        Map<String, Object> body = new java.util.HashMap<>(Map.of(
                "from", from,
                "to", List.of(to),
                "subject", subject,
                "text", textBody));
        if (replyTo != null && !replyTo.isBlank()) {
            body.put("reply_to", replyTo);
        }

        restClient
                .post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    public void sendWithAttachment(
            String from, String to, String subject, String textBody, String attachmentFilename, byte[] attachmentBytes) {
        Map<String, Object> attachment = Map.of(
                "filename", attachmentFilename,
                "content", Base64.getEncoder().encodeToString(attachmentBytes));

        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", subject,
                "text", textBody,
                "attachments", List.of(attachment));

        restClient
                .post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}
