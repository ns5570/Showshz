package com.showszn.backend.booking;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    @Query("""
            select bs from BookingSeat bs
            join fetch bs.showSeat ss
            join fetch ss.seat
            where bs.booking.id = :bookingId
            """)
    List<BookingSeat> findByBookingIdWithSeat(@Param("bookingId") Long bookingId);
}
