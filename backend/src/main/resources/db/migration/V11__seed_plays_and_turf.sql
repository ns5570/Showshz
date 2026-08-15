-- Plays (theatre) and turf (ground/court booking) events, using the same event/event_show
-- model as the other event categories.
INSERT INTO event (title, slug, category, description, image_url, duration_minutes, created_at) VALUES
('Hamlet: A Modern Retelling', 'hamlet-modern-retelling', 'PLAY', 'A stripped-back, contemporary staging of Shakespeare''s tragedy, set in a modern-day boardroom.', 'https://picsum.photos/seed/hamlet-play/500/300', 150, NOW()),
('The Comedy of Errors', 'the-comedy-of-errors', 'PLAY', 'A fast-paced farce of mistaken identities, brought to the stage by a leading city theatre troupe.', 'https://picsum.photos/seed/comedy-errors-play/500/300', 120, NOW()),
('Silence! The Musical', 'silence-the-musical', 'PLAY', 'An original musical drama exploring family, memory, and the things left unsaid.', 'https://picsum.photos/seed/silence-musical/500/300', 110, NOW()),
('5-a-Side Football Turf Night', 'five-a-side-football-turf', 'TURF', 'Book a slot for a 5-a-side football match on a floodlit turf ground.', 'https://picsum.photos/seed/football-turf/500/300', 90, NOW()),
('Box Cricket Turf Slot', 'box-cricket-turf-slot', 'TURF', 'A one-hour box cricket slot on an enclosed turf ground, gear available on request.', 'https://picsum.photos/seed/box-cricket-turf/500/300', 60, NOW()),
('Badminton Court Booking', 'badminton-court-booking', 'TURF', 'A one-hour indoor badminton court slot, racquets and shuttles available on request.', 'https://picsum.photos/seed/badminton-court/500/300', 60, NOW());

-- Event shows: each pinned to a real screen at a real venue, on both "today" and "tomorrow"
INSERT INTO event_show (event_id, screen_id, start_time, end_time, base_price, created_at)
SELECT e.id, sc.id,
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, x.time_of_day),
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, x.time_of_day) + INTERVAL e.duration_minutes MINUTE,
    x.base_price,
    NOW()
FROM event e
JOIN (
    SELECT 'hamlet-modern-retelling' AS event_slug, 'pvr-select-citywalk-delhi' AS venue_slug, 'Audi 1' AS screen_name, CAST('14:00:00' AS TIME) AS time_of_day, 699.00 AS base_price
    UNION ALL SELECT 'the-comedy-of-errors', 'pvr-forum-mall-bengaluru', 'Audi 2', CAST('14:30:00' AS TIME), 599.00
    UNION ALL SELECT 'silence-the-musical', 'pvr-phoenix-marketcity-pune', 'Audi 1', CAST('14:00:00' AS TIME), 799.00
    UNION ALL SELECT 'five-a-side-football-turf', 'pvr-phoenix-marketcity-mumbai', 'Audi 2', CAST('12:00:00' AS TIME), 999.00
    UNION ALL SELECT 'box-cricket-turf-slot', 'inox-r-city-mumbai', 'Audi 1', CAST('12:30:00' AS TIME), 799.00
    UNION ALL SELECT 'badminton-court-booking', 'pvr-vasant-kunj-delhi', 'Audi 2', CAST('11:30:00' AS TIME), 399.00
) AS x ON x.event_slug = e.slug
JOIN venue v ON v.slug = x.venue_slug
JOIN screen sc ON sc.venue_id = v.id AND sc.name = x.screen_name
JOIN (SELECT 0 AS day_offset UNION ALL SELECT 1) AS d ON TRUE;

-- Event show seats: every seat on the show's screen becomes bookable inventory
INSERT INTO event_show_seat (event_show_id, seat_id, price, status)
SELECT
    es.id,
    se.id,
    ROUND(es.base_price * CASE se.seat_type
        WHEN 'REGULAR' THEN 1.0
        WHEN 'PREMIUM' THEN 1.5
        WHEN 'RECLINER' THEN 2.0
    END, 2),
    'AVAILABLE'
FROM event_show es
JOIN seat se ON se.screen_id = es.screen_id
WHERE es.event_id IN (SELECT id FROM event WHERE category IN ('PLAY', 'TURF'));
