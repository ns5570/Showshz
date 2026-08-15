package com.showszn.backend.booking;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

/**
 * Redis-backed seat holding, shared by both movie and event bookings.
 * Callers pass a {@code namespace} ("movie" / "event") so that a ShowSeat id and an
 * EventShowSeat id — which come from separate auto-increment sequences and can collide —
 * never map to the same Redis key.
 */
@Service
public class SeatLockService {

    private static final Duration HOLD_TTL = Duration.ofMinutes(5);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public SeatLockService(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public HoldResult createHold(
            String namespace, String clerkUserId, Long showId, List<Long> showSeatIds, BigDecimal totalAmount) {
        String holdId = UUID.randomUUID().toString();
        List<String> acquiredKeys = new ArrayList<>();

        for (Long seatId : showSeatIds) {
            String key = seatLockKey(namespace, seatId);
            Boolean acquired = redisTemplate.opsForValue().setIfAbsent(key, holdId, HOLD_TTL);
            if (Boolean.TRUE.equals(acquired)) {
                acquiredKeys.add(key);
            } else {
                acquiredKeys.forEach(redisTemplate::delete);
                throw new SeatConflictException("Seat " + seatId + " is already held or booked by someone else");
            }
        }

        HoldPayload payload = new HoldPayload(clerkUserId, showId, showSeatIds, totalAmount);
        redisTemplate.opsForValue().set(holdKey(namespace, holdId), objectMapper.writeValueAsString(payload), HOLD_TTL);

        return new HoldResult(holdId, Instant.now().plus(HOLD_TTL));
    }

    public HoldPayload consumeHold(String namespace, String holdId, String clerkUserId) {
        String json = redisTemplate.opsForValue().get(holdKey(namespace, holdId));
        if (json == null) {
            throw new SeatConflictException("This seat hold has expired. Please select your seats again.");
        }

        HoldPayload payload = objectMapper.readValue(json, HoldPayload.class);
        if (!payload.clerkUserId().equals(clerkUserId)) {
            throw new SeatConflictException("This hold does not belong to the current user");
        }

        for (Long seatId : payload.showSeatIds()) {
            String lockValue = redisTemplate.opsForValue().get(seatLockKey(namespace, seatId));
            if (!holdId.equals(lockValue)) {
                throw new SeatConflictException("The hold on seat " + seatId + " has expired");
            }
        }

        return payload;
    }

    public void releaseHold(String namespace, String holdId, List<Long> showSeatIds) {
        redisTemplate.delete(holdKey(namespace, holdId));
        showSeatIds.forEach(id -> redisTemplate.delete(seatLockKey(namespace, id)));
    }

    public boolean isLocked(String namespace, Long showSeatId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(seatLockKey(namespace, showSeatId)));
    }

    private String seatLockKey(String namespace, Long showSeatId) {
        return namespace + ":seatlock:" + showSeatId;
    }

    private String holdKey(String namespace, String holdId) {
        return namespace + ":hold:" + holdId;
    }

    public record HoldResult(String holdId, Instant expiresAt) {}
}
