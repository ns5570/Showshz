package com.showszn.backend.catalog;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieId(Long movieId);

    @Query("""
            select s from Show s
            join fetch s.movie
            join fetch s.screen sc
            join fetch sc.venue
            where s.id = :id
            """)
    Optional<Show> findByIdWithDetails(@Param("id") Long id);

    @Query("""
            select s from Show s
            join fetch s.screen sc
            join fetch sc.venue v
            where s.movie.id = :movieId
              and v.city.id = :cityId
              and s.startTime between :from and :to
            order by s.startTime
            """)
    List<Show> findByMovieAndCityAndDateRange(
            @Param("movieId") Long movieId,
            @Param("cityId") Long cityId,
            @Param("from") Instant from,
            @Param("to") Instant to);

    @Query("""
            select distinct s.movie from Show s
            where s.screen.venue.city.id = :cityId
              and s.startTime between :from and :to
            order by s.movie.title
            """)
    List<Movie> findMoviesWithUpcomingShowsInCity(
            @Param("cityId") Long cityId,
            @Param("from") Instant from,
            @Param("to") Instant to);

    @Query(
            value = """
                    select s from Show s
                    join fetch s.movie
                    join fetch s.screen sc
                    join fetch sc.venue
                    """,
            countQuery = "select count(s) from Show s")
    Page<Show> findAllWithDetails(Pageable pageable);
}
