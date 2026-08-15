package com.showszn.backend.event;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findBySlug(String slug);

    @Query("""
            select distinct es.event from EventShow es
            where es.screen.venue.city.id = :cityId
              and es.startTime >= :from
            order by es.event.title
            """)
    List<Event> findWithUpcomingShowsInCity(@Param("cityId") Long cityId, @Param("from") Instant from);

    @Query("""
            select distinct es.event from EventShow es
            where es.screen.venue.city.id = :cityId
              and es.event.category = :category
              and es.startTime >= :from
            order by es.event.title
            """)
    List<Event> findWithUpcomingShowsInCityAndCategory(
            @Param("cityId") Long cityId, @Param("category") String category, @Param("from") Instant from);

    @Query("""
            select distinct es.event from EventShow es
            where es.screen.venue.city.id = :cityId
              and es.event.category in :categories
              and es.startTime >= :from
            order by es.event.title
            """)
    List<Event> findWithUpcomingShowsInCityAndCategories(
            @Param("cityId") Long cityId, @Param("categories") List<String> categories, @Param("from") Instant from);

    @Query(value = "select e from Event e", countQuery = "select count(e) from Event e")
    Page<Event> findAllPaged(Pageable pageable);
}
