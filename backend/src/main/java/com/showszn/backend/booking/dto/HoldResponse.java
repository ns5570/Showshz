package com.showszn.backend.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record HoldResponse(String holdId, Instant expiresAt, BigDecimal totalAmount, int seatCount) {}
