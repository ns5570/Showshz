-- 200 additional movies with release dates spread across Sep-Dec 2027, generated from
-- an adjective x noun grid (10 x 20 = 200 unique combinations, so titles/slugs never collide).
INSERT INTO movie (title, slug, description, duration_minutes, language, genre, release_date, poster_url, censor_rating, trailer_url, created_at)
WITH RECURSIVE numbers AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 199
),
adjectives AS (
    SELECT 0 AS idx, 'Crimson' AS word UNION ALL SELECT 1, 'Silent' UNION ALL SELECT 2, 'Broken' UNION ALL
    SELECT 3, 'Golden' UNION ALL SELECT 4, 'Last' UNION ALL SELECT 5, 'Hidden' UNION ALL
    SELECT 6, 'Electric' UNION ALL SELECT 7, 'Velvet' UNION ALL SELECT 8, 'Shattered' UNION ALL SELECT 9, 'Midnight'
),
nouns AS (
    SELECT 0 AS idx, 'Horizon' AS word UNION ALL SELECT 1, 'Kingdom' UNION ALL SELECT 2, 'Symphony' UNION ALL
    SELECT 3, 'Rebellion' UNION ALL SELECT 4, 'Paradox' UNION ALL SELECT 5, 'Voyage' UNION ALL
    SELECT 6, 'Inferno' UNION ALL SELECT 7, 'Mirage' UNION ALL SELECT 8, 'Legacy' UNION ALL SELECT 9, 'Serenade' UNION ALL
    SELECT 10, 'Odyssey' UNION ALL SELECT 11, 'Tempest' UNION ALL SELECT 12, 'Sanctuary' UNION ALL SELECT 13, 'Vendetta' UNION ALL
    SELECT 14, 'Eclipse' UNION ALL SELECT 15, 'Cascade' UNION ALL SELECT 16, 'Requiem' UNION ALL SELECT 17, 'Labyrinth' UNION ALL
    SELECT 18, 'Zenith' UNION ALL SELECT 19, 'Aurora'
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
    DATE('2027-09-01') + INTERVAL FLOOR(numbers.n * 122 / 200) DAY AS release_date,
    CONCAT('https://picsum.photos/seed/movie2027-', numbers.n, '/400/600') AS poster_url,
    r.word AS censor_rating,
    NULL AS trailer_url,
    NOW() AS created_at
FROM numbers
JOIN adjectives a ON a.idx = numbers.n DIV 20
JOIN nouns nn ON nn.idx = numbers.n MOD 20
JOIN genres g ON g.idx = numbers.n MOD 12
JOIN languages l ON l.idx = numbers.n MOD 6
JOIN ratings r ON r.idx = numbers.n MOD 3;

-- One showtime per new movie, rotated across all 70 screens and spread across today/tomorrow
-- x two time slots, so every city sees a healthy share of these movies as "now showing".
INSERT INTO showtime (movie_id, screen_id, start_time, end_time, base_price, created_at)
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
        MOD(m.id, 70) + 1 AS screen_id,
        TIMESTAMP(
            CURRENT_DATE + INTERVAL (CASE WHEN MOD(m.id, 4) IN (2, 3) THEN 1 ELSE 0 END) DAY,
            CASE WHEN MOD(m.id, 4) IN (0, 2) THEN CAST('09:00:00' AS TIME) ELSE CAST('14:00:00' AS TIME) END
        ) AS start_time,
        m.duration_minutes,
        220.00 AS base_price
    FROM movie m
    WHERE m.poster_url LIKE 'https://picsum.photos/seed/movie2027-%'
) AS x;

-- Show seats: every seat on the new showtimes' screens becomes bookable inventory
INSERT INTO show_seat (show_id, seat_id, price, status)
SELECT
    sh.id,
    se.id,
    ROUND(sh.base_price * CASE se.seat_type
        WHEN 'REGULAR' THEN 1.0
        WHEN 'PREMIUM' THEN 1.5
        WHEN 'RECLINER' THEN 2.0
    END, 2),
    'AVAILABLE'
FROM showtime sh
JOIN seat se ON se.screen_id = sh.screen_id
WHERE sh.movie_id IN (SELECT id FROM movie WHERE poster_url LIKE 'https://picsum.photos/seed/movie2027-%');
