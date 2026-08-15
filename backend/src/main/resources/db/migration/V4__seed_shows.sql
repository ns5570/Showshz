-- Shows: every movie at every screen, today + tomorrow, matinee (09:00 UTC = 14:30 IST) + evening (14:00 UTC = 19:30 IST)
INSERT INTO showtime (movie_id, screen_id, start_time, end_time, base_price, created_at)
SELECT
    m.id,
    sc.id,
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, slot.start_time_utc),
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, slot.start_time_utc) + INTERVAL (m.duration_minutes + 15) MINUTE,
    slot.base_price,
    NOW()
FROM movie m
CROSS JOIN screen sc
JOIN (
    SELECT 0 AS day_offset
    UNION ALL SELECT 1
) AS d ON TRUE
JOIN (
    SELECT CAST('09:00:00' AS TIME) AS start_time_utc, 220.00 AS base_price
    UNION ALL SELECT CAST('14:00:00' AS TIME), 280.00
) AS slot ON TRUE;

-- Show seats: every seat on a show's screen becomes bookable inventory for that show
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
JOIN seat se ON se.screen_id = sh.screen_id;
