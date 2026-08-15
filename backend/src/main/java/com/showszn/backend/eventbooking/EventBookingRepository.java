package com.showszn.backend.eventbooking;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {

    @Query("""
            select b from EventBooking b
            join fetch b.eventShow es
            join fetch es.event
            join fetch es.screen sc
            join fetch sc.venue
            where b.bookingReference = :reference
            """)
    Optional<EventBooking> findByBookingReferenceWithDetails(@Param("reference") String reference);

    @Query("""
            select b from EventBooking b
            join fetch b.eventShow es
            join fetch es.event
            join fetch es.screen sc
            join fetch sc.venue
            where b.user.clerkUserId = :clerkUserId
            order by b.createdAt desc
            """)
    List<EventBooking> findByUserClerkIdWithDetails(@Param("clerkUserId") String clerkUserId);
}
