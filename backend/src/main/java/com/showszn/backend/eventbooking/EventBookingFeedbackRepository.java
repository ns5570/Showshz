package com.showszn.backend.eventbooking;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventBookingFeedbackRepository extends JpaRepository<EventBookingFeedback, Long> {
    Optional<EventBookingFeedback> findByEventBookingId(Long eventBookingId);

    List<EventBookingFeedback> findByEventBookingIdIn(List<Long> eventBookingIds);
}
