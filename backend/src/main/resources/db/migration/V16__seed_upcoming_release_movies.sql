-- 90 new movies with release dates spread pseudo-randomly across the next 12 months, so the
-- catalog keeps getting "new releases" over time instead of everything already existing.
-- Uses a disjoint adjective set from V10 (10 x 20 grid there) so titles/slugs never collide.
INSERT INTO movie (title, slug, description, duration_minutes, language, genre, release_date, poster_url, censor_rating, trailer_url, created_at)
WITH RECURSIVE numbers AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 89
),
adjectives AS (
    SELECT 0 AS idx, 'Frozen' AS word UNION ALL SELECT 1, 'Burning' UNION ALL SELECT 2, 'Rising' UNION ALL
    SELECT 3, 'Falling' UNION ALL SELECT 4, 'Ancient' UNION ALL SELECT 5, 'Neon' UNION ALL
    SELECT 6, 'Wild' UNION ALL SELECT 7, 'Quiet' UNION ALL SELECT 8, 'Savage' UNION ALL SELECT 9, 'Radiant'
),
nouns AS (
    SELECT 0 AS idx, 'Horizon' AS word UNION ALL SELECT 1, 'Kingdom' UNION ALL SELECT 2, 'Symphony' UNION ALL
    SELECT 3, 'Rebellion' UNION ALL SELECT 4, 'Paradox' UNION ALL SELECT 5, 'Voyage' UNION ALL
    SELECT 6, 'Inferno' UNION ALL SELECT 7, 'Mirage' UNION ALL SELECT 8, 'Legacy'
),
genres AS (
    SELECT 0 AS idx, 'Action' AS word UNION ALL SELECT 1, 'Drama' UNION ALL SELECT 2, 'Comedy' UNION ALL
    SELECT 3, 'Thriller' UNION ALL SELECT 4, 'Romance' UNION ALL SELECT 5, 'Sci-Fi' UNION ALL
    SELECT 6, 'Horror' UNION ALL SELECT 7, 'Fantasy' UNION ALL SELECT 8, 'Mystery' UNION ALL
    SELECT 9, 'Animation' UNION ALL SELECT 10, 'Adventure' UNION ALL SELECT 11, 'Musical'
),
languages AS (
    SELECT 0 AS idx, 'English' AS word UNION ALL SELECT 1, 'Hindi' UNION ALL SELECT 2, 'Tamil' UNION ALL
    SELECT 3, 'Telugu' UNION ALL SELECT 4, 'Korean' UNION ALL SELECT 5, 'Spanish'
),
ratings AS (
    SELECT 0 AS idx, 'U' AS word UNION ALL SELECT 1, 'UA' UNION ALL SELECT 2, 'A'
)
SELECT
    CONCAT(a.word, ' ', nn.word) AS title,
    LOWER(CONCAT(a.word, '-', nn.word)) AS slug,
    CONCAT('A ', LOWER(g.word), ' story of ', LOWER(a.word), ' stakes, chasing the ', LOWER(nn.word), ' that could change everything.') AS description,
    90 + (numbers.n MOD 61) AS duration_minutes,
    l.word AS language,
    g.word AS genre,
    -- Pseudo-random spread 1-365 days out (never today/past), not an even grid.
    CURRENT_DATE + INTERVAL (1 + MOD(numbers.n * 37 + 13, 364)) DAY AS release_date,
    CONCAT('https://picsum.photos/seed/upcoming-', numbers.n, '/400/600') AS poster_url,
    r.word AS censor_rating,
    NULL AS trailer_url,
    NOW() AS created_at
FROM numbers
JOIN adjectives a ON a.idx = numbers.n DIV 9
JOIN nouns nn ON nn.idx = numbers.n MOD 9
JOIN genres g ON g.idx = numbers.n MOD 12
JOIN languages l ON l.idx = numbers.n MOD 6
JOIN ratings r ON r.idx = numbers.n MOD 3;

-- Weekly showtime in every city for each new movie, same cadence/venue-rotation as
-- V14__seed_two_year_weekly_movie_showtimes.sql, but never before the movie's own
-- release_date -- a movie releasing next March shouldn't be bookable in September.
-- Seat inventory is generated lazily by SeatMapService on first view, same as V14.
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
        m.release_date,
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
    WHERE m.poster_url LIKE 'https://picsum.photos/seed/upcoming-%'
)
SELECT
    x.movie_id,
    x.screen_id,
    x.start_time,
    x.start_time + INTERVAL (x.duration_minutes + 15) MINUTE,
    240.00,
    NOW()
FROM x
WHERE x.show_date >= x.release_date
  AND x.show_date BETWEEN CURRENT_DATE + INTERVAL 1 DAY AND CURRENT_DATE + INTERVAL 730 DAY;
