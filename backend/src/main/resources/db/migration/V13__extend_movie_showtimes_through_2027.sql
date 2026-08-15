-- Give every movie a weekly recurring showtime from today through Dec 31, 2027, rotating
-- across all 10 cities (one representative screen per city) so that any future date a user
-- picks has movies playing in every location, not just "today"/"tomorrow".
--
-- Cadence: each movie plays once a week, on a fixed day-of-week (movie_id mod 7) and a
-- city that rotates week over week (movie_id + week) mod 10. Over enough weeks this spreads
-- every movie across every city while keeping the seeded row count manageable (~15k shows).
INSERT INTO showtime (movie_id, screen_id, start_time, end_time, base_price, created_at)
WITH RECURSIVE weeks AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM weeks WHERE n < 89
),
city_screen AS (
    SELECT city_id, MIN(screen_id) AS screen_id
    FROM (SELECT v.city_id, sc.id AS screen_id FROM venue v JOIN screen sc ON sc.venue_id = v.id) t
    GROUP BY city_id
)
SELECT
    x.movie_id,
    x.screen_id,
    x.start_time,
    x.start_time + INTERVAL (x.duration_minutes + 15) MINUTE,
    x.base_price,
    NOW()
FROM (
    SELECT
        m.id AS movie_id,
        m.duration_minutes,
        cs.screen_id AS screen_id,
        TIMESTAMP(CURRENT_DATE + INTERVAL (w.n * 7 + MOD(m.id, 7)) DAY, CAST('15:00:00' AS TIME)) AS start_time,
        CURRENT_DATE + INTERVAL (w.n * 7 + MOD(m.id, 7)) DAY AS show_date,
        220.00 AS base_price
    FROM movie m
    CROSS JOIN weeks w
    JOIN city_screen cs ON cs.city_id = MOD(m.id + w.n, 10) + 1
) AS x
WHERE x.show_date >= CURRENT_DATE AND x.show_date <= '2027-12-31';

-- Seat inventory (show_seat) is intentionally NOT pre-generated here -- for a 2-year
-- horizon that's tens of millions of rows most of which will never be viewed. SeatMapService
-- generates a showtime's seats lazily, on the first time its seat map is actually requested.
