package com.showszn.backend.event;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventShowSeatRepository extends JpaRepository<EventShowSeat, Long> {

    @Query("""
            select ess from EventShowSeat ess
            join fetch ess.seat
            where ess.eventShow.id = :eventShowId
            order by ess.seat.rowLabel, ess.seat.seatNumber
            """)
    List<EventShowSeat> findByEventShowIdWithSeat(@Param("eventShowId") Long eventShowId);

    @Query("""
            select ess from EventShowSeat ess
            join fetch ess.seat
            join fetch ess.eventShow
            where ess.id in :ids
            """)
    List<EventShowSeat> findByIdsWithSeatAndShow(@Param("ids") List<Long> ids);
}
