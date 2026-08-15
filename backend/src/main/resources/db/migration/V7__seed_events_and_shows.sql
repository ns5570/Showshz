-- Events catalog (like movie)
INSERT INTO event (title, slug, category, description, image_url, duration_minutes, created_at) VALUES
('Zakir Khan: Haq Se Single', 'zakir-khan-haq-se-single', 'COMEDY', 'Zakir Khan returns with his sharpest hour yet on love, loneliness, and everything in between.', 'https://picsum.photos/seed/zakir-khan/500/300', 90, NOW()),
('Vir Das: Wanted', 'vir-das-wanted', 'COMEDY', 'Vir Das brings his globally acclaimed stand-up hour to the stage, fresh off his world tour.', 'https://picsum.photos/seed/vir-das/500/300', 90, NOW()),
('Kanan Gill Live', 'kanan-gill-live', 'COMEDY', 'An evening of observational comedy from one of India''s most-loved stand-up comics.', 'https://picsum.photos/seed/kanan-gill/500/300', 75, NOW()),
('Comedy Store All-Stars Night', 'comedy-store-all-stars', 'COMEDY', 'Four comics, one stage — a showcase night from The Comedy Store''s house lineup.', 'https://picsum.photos/seed/comedy-store/500/300', 100, NOW()),
('Biswa Kalyan Rath: Anti-National', 'biswa-anti-national', 'COMEDY', 'Biswa Kalyan Rath''s newest hour, touring cinema halls across the country.', 'https://picsum.photos/seed/biswa/500/300', 85, NOW()),
('Prateek Kuhad: Live', 'prateek-kuhad-live', 'MUSIC', 'Prateek Kuhad performs songs from his latest album live in concert.', 'https://picsum.photos/seed/prateek-live/500/300', 120, NOW()),
('Nucleya: Bass Nation Tour', 'nucleya-bass-nation', 'MUSIC', 'India''s bass music pioneer brings his biggest tour yet to your city.', 'https://picsum.photos/seed/nucleya/500/300', 120, NOW()),
('Pro Kabaddi League Night', 'pro-kabaddi-league-night', 'SPORTS', 'Live Pro Kabaddi League action on the big screen with a stadium-style atmosphere.', 'https://picsum.photos/seed/kabaddi/500/300', 150, NOW()),
('Celebrity Cricket League Final', 'ccl-final', 'SPORTS', 'The Celebrity Cricket League final, screened live with fan zones and giveaways.', 'https://picsum.photos/seed/ccl-final/500/300', 150, NOW()),
('Pottery & Wine Workshop', 'pottery-wine-workshop', 'ACTIVITY', 'A relaxed hands-on pottery session paired with a wine tasting flight.', 'https://picsum.photos/seed/pottery/500/300', 120, NOW()),
('Startup Founders Meetup', 'startup-founders-meetup', 'ACTIVITY', 'An evening of lightning talks and networking for early-stage founders.', 'https://picsum.photos/seed/founders/500/300', 120, NOW()),
('Modern Art Showcase', 'modern-art-showcase', 'EXHIBITION', 'A curated showcase of contemporary Indian artists, with a guided walkthrough.', 'https://picsum.photos/seed/modern-art/500/300', 180, NOW());

-- Event shows: each pinned to a real screen at a real venue, on both "today" and "tomorrow"
-- (mirrors the movie seed pattern) so the listing is robust regardless of exactly when this
-- migration runs relative to the IST day boundary used for display.
-- time_of_day values below are UTC equivalents of the intended IST showtime (IST = UTC + 5:30)
INSERT INTO event_show (event_id, screen_id, start_time, end_time, base_price, created_at)
SELECT e.id, sc.id,
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, x.time_of_day),
    TIMESTAMP(CURRENT_DATE + INTERVAL d.day_offset DAY, x.time_of_day) + INTERVAL e.duration_minutes MINUTE,
    x.base_price,
    NOW()
FROM event e
JOIN (
    SELECT 'zakir-khan-haq-se-single' AS event_slug, 'pvr-phoenix-marketcity-mumbai' AS venue_slug, 'Audi 1' AS screen_name, CAST('14:30:00' AS TIME) AS time_of_day, 899.00 AS base_price
    UNION ALL SELECT 'vir-das-wanted', 'pvr-forum-mall-bengaluru', 'Audi 1', CAST('14:30:00' AS TIME), 999.00
    UNION ALL SELECT 'kanan-gill-live', 'pvr-select-citywalk-delhi', 'Audi 1', CAST('14:00:00' AS TIME), 799.00
    UNION ALL SELECT 'comedy-store-all-stars', 'pvr-phoenix-marketcity-chennai', 'Audi 2', CAST('14:30:00' AS TIME), 699.00
    UNION ALL SELECT 'biswa-anti-national', 'pvr-phoenix-marketcity-pune', 'Audi 1', CAST('14:30:00' AS TIME), 849.00
    UNION ALL SELECT 'biswa-anti-national', 'pvr-inorbit-mall-hyderabad', 'Audi 1', CAST('13:30:00' AS TIME), 799.00
    UNION ALL SELECT 'prateek-kuhad-live', 'pvr-vasant-kunj-delhi', 'Audi 1', CAST('14:30:00' AS TIME), 1999.00
    UNION ALL SELECT 'nucleya-bass-nation', 'inox-r-city-mumbai', 'Audi 2', CAST('15:30:00' AS TIME), 1499.00
    UNION ALL SELECT 'pro-kabaddi-league-night', 'pvr-alpha-one-mall-ahmedabad', 'Audi 1', CAST('13:30:00' AS TIME), 499.00
    UNION ALL SELECT 'ccl-final', 'inox-crystal-palm-jaipur', 'Audi 1', CAST('12:30:00' AS TIME), 599.00
    UNION ALL SELECT 'pottery-wine-workshop', 'inox-quest-mall-kolkata', 'Audi 2', CAST('11:30:00' AS TIME), 999.00
    UNION ALL SELECT 'startup-founders-meetup', 'pvr-elante-mall-chandigarh', 'Audi 1', CAST('11:30:00' AS TIME), 299.00
    UNION ALL SELECT 'modern-art-showcase', 'inox-garuda-mall-bengaluru', 'Audi 2', CAST('10:30:00' AS TIME), 399.00
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
JOIN seat se ON se.screen_id = es.screen_id;
