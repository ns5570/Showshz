CREATE TABLE event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    venue_name VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_city FOREIGN KEY (city_id) REFERENCES city (id)
) ENGINE = InnoDB;

CREATE INDEX idx_event_city_id ON event (city_id);

INSERT INTO event (city_id, title, category, venue_name, event_date, price, image_url, description, created_at)
SELECT c.id, e.title, e.category, e.venue_name, CURRENT_DATE + INTERVAL e.days_ahead DAY, e.price, e.image_url, e.description, NOW()
FROM city c
JOIN (
    SELECT 'mumbai' AS city_slug, 'Sunburn Arena ft. Nucleya' AS title, 'MUSIC' AS category, 'MMRDA Grounds' AS venue_name, 14 AS days_ahead, 1499.00 AS price, 'https://picsum.photos/seed/sunburn-mumbai/500/300' AS image_url, 'India''s biggest EDM festival lands in Mumbai with a headline set from Nucleya.' AS description
    UNION ALL SELECT 'mumbai', 'Zakir Hussain Live in Concert', 'MUSIC', 'NCPA Tata Theatre', 21, 2499.00, 'https://picsum.photos/seed/zakir-mumbai/500/300', 'A rare evening of Indian classical percussion from the tabla maestro.'
    UNION ALL SELECT 'bengaluru', 'Bengaluru Comedy Festival', 'COMEDY', 'Phoenix Marketcity Grounds', 10, 799.00, 'https://picsum.photos/seed/comedy-bengaluru/500/300', 'A weekend of stand-up from India''s sharpest comics.'
    UNION ALL SELECT 'bengaluru', 'Vipul Goyal: Aukaat Tour', 'COMEDY', 'Chowdiah Memorial Hall', 18, 899.00, 'https://picsum.photos/seed/vipul-bengaluru/500/300', 'Vipul Goyal brings his newest hour of stand-up to Bengaluru.'
    UNION ALL SELECT 'delhi', 'Delhi Art & Design Week', 'EXHIBITION', 'India Habitat Centre', 12, 499.00, 'https://picsum.photos/seed/art-delhi/500/300', 'Contemporary art, design installations, and gallery walkthroughs.'
    UNION ALL SELECT 'delhi', 'Prateek Kuhad: Live', 'MUSIC', 'Jawaharlal Nehru Stadium', 25, 1999.00, 'https://picsum.photos/seed/prateek-delhi/500/300', 'Prateek Kuhad performs songs from his latest album live in Delhi.'
    UNION ALL SELECT 'hyderabad', 'Hyderabad Food & Wine Festival', 'FOOD', 'HITEX Exhibition Centre', 16, 599.00, 'https://picsum.photos/seed/food-hyderabad/500/300', 'A curated tasting trail from the city''s best chefs and wineries.'
    UNION ALL SELECT 'chennai', 'Carnatic Music Fest', 'MUSIC', 'Music Academy Chennai', 20, 699.00, 'https://picsum.photos/seed/carnatic-chennai/500/300', 'A season of Carnatic vocal and instrumental performances by leading artists.'
    UNION ALL SELECT 'pune', 'Pune Startup Summit', 'WORKSHOP', 'MCA Trade Centre', 9, 999.00, 'https://picsum.photos/seed/startup-pune/500/300', 'Founders, investors, and builders gather for a day of talks and networking.'
    UNION ALL SELECT 'jaipur', 'Jaipur Literature Festival', 'EXHIBITION', 'Diggi Palace', 30, 0.00, 'https://picsum.photos/seed/jlf-jaipur/500/300', 'The world''s largest free literary festival returns to the Pink City.'
) AS e ON e.city_slug = c.slug;
