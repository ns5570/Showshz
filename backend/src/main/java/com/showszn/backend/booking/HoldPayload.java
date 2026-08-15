package com.showszn.backend.booking;

import java.math.BigDecimal;
import java.util.List;

public record HoldPayload(String clerkUserId, Long showId, List<Long> showSeatIds, BigDecimal totalAmount) {}
