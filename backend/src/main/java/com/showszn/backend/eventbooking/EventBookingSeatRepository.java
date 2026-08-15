package com.showszn.backend.eventbooking;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventBookingSeatRepository extends JpaRepository<EventBookingSeat, Long> {

    @Query("""
            select bs from EventBookingSeat bs
            join fetch bs.eventShowSeat ess
            join fetch ess.seat
            where bs.eventBooking.id = :bookingId
            """)
    List<EventBookingSeat> findByBookingIdWithSeat(@Param("bookingId") Long bookingId);
}
