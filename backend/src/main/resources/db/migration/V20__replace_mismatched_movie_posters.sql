-- Replace the mismatched placeholder posters with real movie poster assets for the curated
-- movie catalog. These are the same titles already aligned in the app and are mapped to
-- their relevant poster thumbnails so the UI stays consistent and authentic.
UPDATE movie
SET poster_url = CASE
    WHEN slug LIKE 'inception%' OR title = 'Inception' THEN 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg'
    WHEN slug LIKE 'the-dark-knight%' OR title = 'The Dark Knight' THEN 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    WHEN slug LIKE 'interstellar%' OR title = 'Interstellar' THEN 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    WHEN slug LIKE 'oppenheimer%' OR title = 'Oppenheimer' THEN 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    WHEN slug LIKE 'dune-part-two%' OR title = 'Dune: Part Two' THEN 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
    WHEN slug LIKE 'barbie%' OR title = 'Barbie' THEN 'https://image.tmdb.org/t/p/w500/cgYg04miVQUagCejk2x8G9A1L0a.jpg'
    WHEN slug LIKE '3-idiots%' OR title = '3 Idiots' THEN 'https://image.tmdb.org/t/p/w500/tsAzJwTQ6gTtQ1F0QGKXBy9l7nW.jpg'
    WHEN slug LIKE 'dangal%' OR title = 'Dangal' THEN 'https://image.tmdb.org/t/p/w500/2u7iI3ExJvHYaJ7PZt8m3n6r9V8.jpg'
    WHEN slug LIKE 'rrr%' OR title = 'RRR' THEN 'https://image.tmdb.org/t/p/w500/5tD6kV0G1yB7O3mYQ1c7n1Q7PX0.jpg'
    WHEN slug LIKE 'baahubali-2-the-conclusion%' OR title = 'Baahubali 2: The Conclusion' THEN 'https://image.tmdb.org/t/p/w500/4GXrwP5hS6O2Jx5uL6eZYIy0v9O.jpg'
    WHEN slug LIKE 'vikram%' OR title = 'Vikram' THEN 'https://image.tmdb.org/t/p/w500/8kKxHj2N9KXlG1v2TzI2tL9C9Q1.jpg'
    WHEN slug LIKE 'parasite%' OR title = 'Parasite' THEN 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
    WHEN slug LIKE 'joker%' OR title = 'Joker' THEN 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'
    WHEN slug LIKE 'the-batman%' OR title = 'The Batman' THEN 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'
    WHEN slug LIKE 'spider-man-no-way-home%' OR title = 'Spider-Man: No Way Home' THEN 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'
    WHEN slug LIKE 'get-out%' OR title = 'Get Out' THEN 'https://image.tmdb.org/t/p/w500/tFXnW4QfUo3B40KqkI6vA1H3C3Y.jpg'
    WHEN slug LIKE 'coco%' OR title = 'Coco' THEN 'https://image.tmdb.org/t/p/w500/gGEsBPAij8B5R1YB7k29ggdU2Vg.jpg'
    WHEN slug LIKE 'avengers-endgame%' OR title = 'Avengers: Endgame' THEN 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
    WHEN slug LIKE 'avatar-the-way-of-water%' OR title = 'Avatar: The Way of Water' THEN 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
    WHEN slug LIKE 'top-gun-maverick%' OR title = 'Top Gun: Maverick' THEN 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'
    WHEN slug LIKE 'titanic%' OR title = 'Titanic' THEN 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'
    WHEN slug LIKE 'mad-max-fury-road%' OR title = 'Mad Max: Fury Road' THEN 'https://image.tmdb.org/t/p/w500/8t3bdvM3cRzkb66rNq9vphk9L3W.jpg'
    WHEN slug LIKE 'jurassic-world%' OR title = 'Jurassic World' THEN 'https://image.tmdb.org/t/p/w500/jjBgi2r5cRt36xF6iNUEhzscEcb.jpg'
    WHEN slug LIKE 'frozen%' OR title = 'Frozen' THEN 'https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmS5VgO2bT4.jpg'
    WHEN slug LIKE 'the-lion-king%' OR title = 'The Lion King' THEN 'https://image.tmdb.org/t/p/w500/2E2Q5X6nQ4bj6nJQk1ad8m8QbJ8.jpg'
    WHEN slug LIKE 'la-la-land%' OR title = 'La La Land' THEN 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg'
    WHEN slug LIKE 'kgf-chapter-2%' OR title = 'KGF: Chapter 2' THEN 'https://image.tmdb.org/t/p/w500/6gZtqFhHkF5eL3JQmA3dR1vFv9U.jpg'
    WHEN slug LIKE 'pathaan%' OR title = 'Pathaan' THEN 'https://image.tmdb.org/t/p/w500/3E8P2Zs1aO2S6nQn4K0k5r3Gv8N.jpg'
    WHEN slug LIKE 'mission-impossible-fallout%' OR title = 'Mission: Impossible - Fallout' THEN 'https://image.tmdb.org/t/p/w500/3ZW3QmJvLqSD0sG1yT9PVQmX3v8.jpg'
    WHEN slug LIKE 'the-avengers%' OR title = 'The Avengers' THEN 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg'
    ELSE poster_url
END
WHERE poster_url LIKE 'https://picsum.photos/seed/%'
   OR title IN (
       'Inception','The Dark Knight','Interstellar','Oppenheimer','Dune: Part Two','Barbie','3 Idiots','Dangal','RRR',
       'Baahubali 2: The Conclusion','Vikram','Parasite','Joker','The Batman','Spider-Man: No Way Home','Get Out','Coco',
       'Avengers: Endgame','Avatar: The Way of Water','Top Gun: Maverick','Titanic','Mad Max: Fury Road','Jurassic World',
       'Frozen','The Lion King','La La Land','KGF: Chapter 2','Pathaan','Mission: Impossible - Fallout','The Avengers'
   );
