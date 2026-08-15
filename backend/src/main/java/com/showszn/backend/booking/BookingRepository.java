package com.showszn.backend.booking;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            select b from Booking b
            join fetch b.show sh
            join fetch sh.movie
            join fetch sh.screen sc
            join fetch sc.venue
            where b.bookingReference = :reference
            """)
    Optional<Booking> findByBookingReferenceWithDetails(@Param("reference") String reference);

    @Query("""
            select b from Booking b
            join fetch b.show sh
            join fetch sh.movie
            join fetch sh.screen sc
            join fetch sc.venue
            where b.user.clerkUserId = :clerkUserId
            order by b.createdAt desc
            """)
    List<Booking> findByUserClerkIdWithDetails(@Param("clerkUserId") String clerkUserId);
}
