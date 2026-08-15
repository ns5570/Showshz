package com.showszn.backend.catalog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Keeps every movie's showtime schedule extended ~2 years into the future, so the catalog
 * never runs out of upcoming dates without a manual reseed. Uses the same epoch
 * ('2024-01-01'), day-of-week formula, and 2-slots-per-week density as
 * V18__denser_shows_all_locations_dates_halls.sql, so re-running it nightly with a NOT
 * EXISTS guard is idempotent -- it only inserts the slice of the schedule that has newly
 * rolled into the 2-year window since the last run.
 */
@Component
public class ShowtimeHorizonScheduler {

    private static final Logger log = LoggerFactory.getLogger(ShowtimeHorizonScheduler.class);

    private static final String INSERT_SHOWTIMES =
            """
            INSERT INTO showtime (movie_id, screen_id, start_time, end_time, base_price, created_at)
            WITH RECURSIVE weeks AS (
                SELECT FLOOR(DATEDIFF(CURRENT_DATE, '2024-01-01') / 7) AS n
                UNION ALL
                SELECT n + 1 FROM weeks WHERE n < FLOOR(DATEDIFF(CURRENT_DATE, '2024-01-01') / 7) + 106
            ),
            city_venues AS (
                SELECT v.id AS venue_id, v.city_id,
                       ROW_NUMBER() OVER (PARTITION BY v.city_id ORDER BY v.id) - 1 AS venue_idx,
                       COUNT(*) OVER (PARTITION BY v.city_id) AS venue_count
                FROM venue v
            ),
            venue_screens AS (
                SELECT sc.id AS screen_id, sc.venue_id,
                       ROW_NUMBER() OVER (PARTITION BY sc.venue_id ORDER BY sc.id) - 1 AS screen_idx,
                       COUNT(*) OVER (PARTITION BY sc.venue_id) AS screen_count
                FROM screen sc
            ),
            slots AS (
                SELECT 0 AS slot_idx, CAST('09:00:00' AS TIME) AS start_clock, 0 AS screen_offset, 200.00 AS base_price
                UNION ALL SELECT 1, CAST('14:00:00' AS TIME), 1, 260.00
            ),
            x AS (
                SELECT
                    m.id AS movie_id,
                    m.duration_minutes,
                    m.release_date,
                    m.poster_url,
                    vs.screen_id,
                    slots.base_price,
                    TIMESTAMP(
                        DATE_ADD('2024-01-01', INTERVAL (w.n * 7 + MOD(m.id * 7 + c.id * 3 + w.n * 5, 7)) DAY),
                        slots.start_clock
                    ) AS start_time,
                    DATE_ADD('2024-01-01', INTERVAL (w.n * 7 + MOD(m.id * 7 + c.id * 3 + w.n * 5, 7)) DAY) AS show_date
                FROM movie m
                CROSS JOIN city c
                CROSS JOIN weeks w
                CROSS JOIN slots
                JOIN city_venues cv ON cv.city_id = c.id AND cv.venue_idx = MOD(m.id + w.n, cv.venue_count)
                JOIN venue_screens vs ON vs.venue_id = cv.venue_id
                    AND vs.screen_idx = MOD(m.id + w.n + slots.screen_offset, vs.screen_count)
            )
            SELECT
                x.movie_id,
                x.screen_id,
                x.start_time,
                x.start_time + INTERVAL (x.duration_minutes + 15) MINUTE,
                x.base_price,
                NOW()
            FROM x
            WHERE (x.poster_url NOT LIKE 'https://picsum.photos/seed/upcoming-%' OR x.show_date >= x.release_date)
              AND x.show_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 730 DAY
              AND NOT EXISTS (
                  SELECT 1 FROM showtime s2
                  WHERE s2.movie_id = x.movie_id AND s2.screen_id = x.screen_id AND s2.start_time = x.start_time
              )
            """;

    private final JdbcTemplate jdbcTemplate;

    public ShowtimeHorizonScheduler(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(cron = "0 5 0 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void extendHorizon() {
        int showtimesInserted = jdbcTemplate.update(INSERT_SHOWTIMES);
        log.info("Showtime horizon extension: inserted {} showtimes", showtimesInserted);
    }
}
