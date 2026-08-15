package com.showszn.backend.event;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventShowRepository extends JpaRepository<EventShow, Long> {

    @Query("""
            select es from EventShow es
            join fetch es.event
            join fetch es.screen sc
            join fetch sc.venue
            where es.id = :id
            """)
    Optional<EventShow> findByIdWithDetails(@Param("id") Long id);

    @Query("""
            select es from EventShow es
            join fetch es.screen sc
            join fetch sc.venue v
            where es.event.id = :eventId
              and v.city.id = :cityId
              and es.startTime between :from and :to
            order by es.startTime
            """)
    List<EventShow> findByEventAndCityAndDateRange(
            @Param("eventId") Long eventId,
            @Param("cityId") Long cityId,
            @Param("from") Instant from,
            @Param("to") Instant to);

    @Query(
            value = """
                    select es from EventShow es
                    join fetch es.event
                    join fetch es.screen sc
                    join fetch sc.venue
                    """,
            countQuery = "select count(es) from EventShow es")
    Page<EventShow> findAllWithDetails(Pageable pageable);
}
