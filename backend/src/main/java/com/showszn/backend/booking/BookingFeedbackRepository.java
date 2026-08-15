package com.showszn.backend.booking;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingFeedbackRepository extends JpaRepository<BookingFeedback, Long> {
    Optional<BookingFeedback> findByBookingId(Long bookingId);

    List<BookingFeedback> findByBookingIdIn(List<Long> bookingIds);
}
