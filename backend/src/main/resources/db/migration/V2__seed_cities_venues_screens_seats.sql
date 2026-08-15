-- Cities
INSERT INTO city (name, state, slug, latitude, longitude, created_at) VALUES
('Mumbai', 'Maharashtra', 'mumbai', 19.076000, 72.877700, NOW()),
('Bengaluru', 'Karnataka', 'bengaluru', 12.971600, 77.594600, NOW()),
('Delhi', 'Delhi', 'delhi', 28.704100, 77.102500, NOW()),
('Hyderabad', 'Telangana', 'hyderabad', 17.385000, 78.486700, NOW()),
('Chennai', 'Tamil Nadu', 'chennai', 13.082700, 80.270700, NOW()),
('Pune', 'Maharashtra', 'pune', 18.520400, 73.856700, NOW()),
('Kolkata', 'West Bengal', 'kolkata', 22.572600, 88.363900, NOW()),
('Ahmedabad', 'Gujarat', 'ahmedabad', 23.022500, 72.571400, NOW()),
('Jaipur', 'Rajasthan', 'jaipur', 26.912400, 75.787300, NOW()),
('Chandigarh', 'Chandigarh', 'chandigarh', 30.733300, 76.779400, NOW());

-- Venues: 3-4 malls per city
INSERT INTO venue (city_id, name, address, slug, created_at)
SELECT c.id, v.name, v.address, v.slug, NOW()
FROM city c
JOIN (
    -- Mumbai
    SELECT 'mumbai' AS city_slug, 'PVR Phoenix Marketcity' AS name, 'Kurla West, Mumbai' AS address, 'pvr-phoenix-marketcity-mumbai' AS slug
    UNION ALL SELECT 'mumbai', 'INOX R-City', 'Ghatkopar West, Mumbai', 'inox-r-city-mumbai'
    UNION ALL SELECT 'mumbai', 'PVR ICON Infiniti Mall', 'Malad West, Mumbai', 'pvr-icon-infiniti-mumbai'
    UNION ALL SELECT 'mumbai', 'Cinepolis Fun Republic', 'Andheri West, Mumbai', 'cinepolis-fun-republic-mumbai'
    -- Bengaluru
    UNION ALL SELECT 'bengaluru', 'PVR Forum Mall', 'Koramangala, Bengaluru', 'pvr-forum-mall-bengaluru'
    UNION ALL SELECT 'bengaluru', 'INOX Garuda Mall', 'Magrath Road, Bengaluru', 'inox-garuda-mall-bengaluru'
    UNION ALL SELECT 'bengaluru', 'PVR Orion Mall', 'Rajajinagar, Bengaluru', 'pvr-orion-mall-bengaluru'
    UNION ALL SELECT 'bengaluru', 'Cinepolis Nexus Mall', 'Koramangala, Bengaluru', 'cinepolis-nexus-bengaluru'
    -- Delhi
    UNION ALL SELECT 'delhi', 'PVR Select Citywalk', 'Saket, Delhi', 'pvr-select-citywalk-delhi'
    UNION ALL SELECT 'delhi', 'PVR Vasant Kunj', 'Vasant Kunj, Delhi', 'pvr-vasant-kunj-delhi'
    UNION ALL SELECT 'delhi', 'INOX Nehru Place', 'Nehru Place, Delhi', 'inox-nehru-place-delhi'
    UNION ALL SELECT 'delhi', 'DT Cinemas Saket', 'Saket, Delhi', 'dt-cinemas-saket-delhi'
    -- Hyderabad
    UNION ALL SELECT 'hyderabad', 'PVR Inorbit Mall', 'Madhapur, Hyderabad', 'pvr-inorbit-mall-hyderabad'
    UNION ALL SELECT 'hyderabad', 'INOX GVK One', 'Banjara Hills, Hyderabad', 'inox-gvk-one-hyderabad'
    UNION ALL SELECT 'hyderabad', 'Prasads Multiplex', 'Necklace Road, Hyderabad', 'prasads-multiplex-hyderabad'
    UNION ALL SELECT 'hyderabad', 'AAA Cinemas', 'Ameerpet, Hyderabad', 'aaa-cinemas-hyderabad'
    -- Chennai
    UNION ALL SELECT 'chennai', 'PVR Phoenix MarketCity', 'Velachery, Chennai', 'pvr-phoenix-marketcity-chennai'
    UNION ALL SELECT 'chennai', 'AGS Cinemas VR Chennai', 'Anna Nagar, Chennai', 'ags-cinemas-vr-chennai'
    UNION ALL SELECT 'chennai', 'PVR The Grand Avenue', 'Nungambakkam, Chennai', 'pvr-grand-avenue-chennai'
    UNION ALL SELECT 'chennai', 'Heritage Cinemas', 'T. Nagar, Chennai', 'heritage-cinemas-chennai'
    -- Pune
    UNION ALL SELECT 'pune', 'PVR Phoenix Marketcity Pune', 'Viman Nagar, Pune', 'pvr-phoenix-marketcity-pune'
    UNION ALL SELECT 'pune', 'INOX Bund Garden', 'Bund Garden Road, Pune', 'inox-bund-garden-pune'
    UNION ALL SELECT 'pune', 'Cinepolis Seasons Mall', 'Magarpatta, Pune', 'cinepolis-seasons-pune'
    -- Kolkata
    UNION ALL SELECT 'kolkata', 'INOX Quest Mall', 'Syed Amir Ali Ave, Kolkata', 'inox-quest-mall-kolkata'
    UNION ALL SELECT 'kolkata', 'PVR Avani Riverside', 'Howrah, Kolkata', 'pvr-avani-riverside-kolkata'
    UNION ALL SELECT 'kolkata', 'Cinepolis Acropolis Mall', 'Rajdanga, Kolkata', 'cinepolis-acropolis-kolkata'
    -- Ahmedabad
    UNION ALL SELECT 'ahmedabad', 'PVR Alpha One Mall', 'Vastrapur, Ahmedabad', 'pvr-alpha-one-mall-ahmedabad'
    UNION ALL SELECT 'ahmedabad', 'INOX Iscon Mega Mall', 'Iscon, Ahmedabad', 'inox-iscon-mega-mall-ahmedabad'
    UNION ALL SELECT 'ahmedabad', 'Cinepolis Ahmedabad One', 'Vastrapur, Ahmedabad', 'cinepolis-ahmedabad-one'
    -- Jaipur
    UNION ALL SELECT 'jaipur', 'INOX Crystal Palm', 'C-Scheme, Jaipur', 'inox-crystal-palm-jaipur'
    UNION ALL SELECT 'jaipur', 'PVR WTP Mall', 'Vaishali Nagar, Jaipur', 'pvr-wtp-mall-jaipur'
    UNION ALL SELECT 'jaipur', 'Cinepolis Triton Mall', 'Jagatpura, Jaipur', 'cinepolis-triton-jaipur'
    -- Chandigarh
    UNION ALL SELECT 'chandigarh', 'PVR Elante Mall', 'Industrial Area, Chandigarh', 'pvr-elante-mall-chandigarh'
    UNION ALL SELECT 'chandigarh', 'INOX Piccadily Square', 'Sector 34, Chandigarh', 'inox-piccadily-square-chandigarh'
    UNION ALL SELECT 'chandigarh', 'Cinepolis Punjab', 'Sector 17, Chandigarh', 'cinepolis-punjab-chandigarh'
) AS v ON v.city_slug = c.slug;

-- Screens: 2 per venue
INSERT INTO screen (venue_id, name, created_at)
SELECT v.id, x.name, NOW()
FROM venue v
JOIN (
    SELECT 'Audi 1' AS name
    UNION ALL SELECT 'Audi 2'
) AS x ON TRUE;

-- Seats: realistic 9-row multiplex layout per screen
-- Rows A-C: Regular (14 seats), D-G: Premium (14 seats), H-I: Recliner (8 seats)
-- = 114 seats per screen
INSERT INTO seat (screen_id, row_label, seat_number, seat_type)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 14
)
SELECT sc.id, r.row_label, seq.n, r.seat_type
FROM screen sc
JOIN (
    SELECT 'A' AS row_label, 'REGULAR' AS seat_type, 14 AS seat_count
    UNION ALL SELECT 'B', 'REGULAR', 14
    UNION ALL SELECT 'C', 'REGULAR', 14
    UNION ALL SELECT 'D', 'PREMIUM', 14
    UNION ALL SELECT 'E', 'PREMIUM', 14
    UNION ALL SELECT 'F', 'PREMIUM', 14
    UNION ALL SELECT 'G', 'PREMIUM', 14
    UNION ALL SELECT 'H', 'RECLINER', 8
    UNION ALL SELECT 'I', 'RECLINER', 8
) AS r ON TRUE
JOIN seq ON seq.n <= r.seat_count;
