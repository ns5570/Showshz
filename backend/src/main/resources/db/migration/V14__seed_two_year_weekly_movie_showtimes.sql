-- Replace the sparse "one city per movie per week" rotation from V13 (which meant any
-- given city only saw ~20% of the catalog at a time) with weekly showtimes for every
-- movie in every city, running two years out. Movies rotate across each city's venues
-- ("malls") and screens week to week, and land on a different day of week each week so
-- the schedule doesn't look mechanically identical every 7 days.
--
-- Only future, unbooked showtimes are touched -- anything with a real booking (and
-- everything dated "today" or earlier) is left alone.
DELETE ss FROM show_seat ss
JOIN showtime s ON s.id = ss.show_id
WHERE s.start_time >= CURRENT_DATE + INTERVAL 1 DAY
  AND s.id NOT IN (SELECT show_id FROM booking);

DELETE s FROM showtime s
WHERE s.start_time >= CURRENT_DATE + INTERVAL 1 DAY
  AND s.id NOT IN (SELECT show_id FROM booking);

-- Epoch anchor ('2024-01-01') and the week-index formula below are shared with
-- ShowtimeHorizonScheduler, which extends this same schedule forward every night so the
-- catalog always has ~2 years of future shows without another manual backfill.
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
x AS (
    SELECT
        m.id AS movie_id,
        m.duration_minutes,
        vs.screen_id,
        TIMESTAMP(
            DATE_ADD('2024-01-01', INTERVAL (w.n * 7 + MOD(m.id * 7 + c.id * 3 + w.n * 5, 7)) DAY),
            '14:00:00'
        ) AS start_time,
        DATE_ADD('2024-01-01', INTERVAL (w.n * 7 + MOD(m.id * 7 + c.id * 3 + w.n * 5, 7)) DAY) AS show_date
    FROM movie m
    CROSS JOIN city c
    CROSS JOIN weeks w
    JOIN city_venues cv ON cv.city_id = c.id AND cv.venue_idx = MOD(m.id + w.n, cv.venue_count)
    JOIN venue_screens vs ON vs.venue_id = cv.venue_id AND vs.screen_idx = MOD(m.id + w.n, vs.screen_count)
)
SELECT
    x.movie_id,
    x.screen_id,
    x.start_time,
    x.start_time + INTERVAL (x.duration_minutes + 15) MINUTE,
    240.00,
    NOW()
FROM x
WHERE x.show_date BETWEEN CURRENT_DATE + INTERVAL 1 DAY AND CURRENT_DATE + INTERVAL 730 DAY;

-- Seat inventory is generated lazily by SeatMapService the first time a showtime's seat
-- map is actually requested, not pre-materialized here -- pre-generating show_seat for
-- every one of ~220k showtimes over 2 years is tens of millions of rows that would mostly
-- go unused (and doesn't fit a small hosted database).
