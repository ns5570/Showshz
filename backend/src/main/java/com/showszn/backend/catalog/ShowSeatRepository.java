package com.showszn.backend.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {

    @Query("""
            select ss from ShowSeat ss
            join fetch ss.seat
            where ss.show.id = :showId
            order by ss.seat.rowLabel, ss.seat.seatNumber
            """)
    List<ShowSeat> findByShowIdWithSeat(@Param("showId") Long showId);

    @Query("""
            select ss from ShowSeat ss
            join fetch ss.seat
            join fetch ss.show sh
            where ss.id in :ids
            """)
    List<ShowSeat> findByIdsWithSeatAndShow(@Param("ids") List<Long> ids);
}
