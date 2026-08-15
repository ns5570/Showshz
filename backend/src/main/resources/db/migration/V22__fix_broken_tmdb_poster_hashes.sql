-- V20 mapped the curated real-movie catalog to TMDB poster paths, but half of those hashes
-- were wrong/non-existent and 404 on image.tmdb.org, so those rows still rendered a broken
-- image icon instead of a relevant poster. Replace just the broken ones with hashes verified
-- (via HTTP 200 + visual check) against the real TMDB pages for each film.
UPDATE movie
SET poster_url = CASE
    WHEN title = 'Barbie' THEN 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg'
    WHEN title = '3 Idiots' THEN 'https://image.tmdb.org/t/p/w500/gmSRHU1Wtiatj8KoyVt8rT9ockx.jpg'
    WHEN title = 'Dangal' THEN 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg'
    WHEN title = 'RRR' THEN 'https://image.tmdb.org/t/p/w500/tjpiEnZBUAA8pdNPRKa5vP2Zpqw.jpg'
    WHEN title = 'Baahubali 2: The Conclusion' THEN 'https://image.tmdb.org/t/p/w500/sXf30F2HFpsFPXlNz7jpOySSV9I.jpg'
    WHEN title = 'Vikram' THEN 'https://image.tmdb.org/t/p/w500/ihjsoa6p8VEr0vIF95SZ0JBEbZ6.jpg'
    WHEN title = 'Get Out' THEN 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg'
    WHEN title = 'Coco' THEN 'https://image.tmdb.org/t/p/w500/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg'
    WHEN title = 'Mad Max: Fury Road' THEN 'https://image.tmdb.org/t/p/w500/ulcAi4dKpAjHwYGS08vNyx9H6I9.jpg'
    WHEN title = 'Jurassic World' THEN 'https://image.tmdb.org/t/p/w500/tuv9JAg1XvKrvD8AlxTU6BbQ6W.jpg'
    WHEN title = 'Frozen' THEN 'https://image.tmdb.org/t/p/w500/itAKcobTYGpYT8Phwjd8c9hleTo.jpg'
    WHEN title = 'The Lion King' THEN 'https://image.tmdb.org/t/p/w500/dzBtMocZuJbjLOXvrl4zGYigDzh.jpg'
    WHEN title = 'KGF: Chapter 2' THEN 'https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg'
    WHEN title = 'Pathaan' THEN 'https://image.tmdb.org/t/p/w500/arf00BkwvXo0CFKbaD9OpqdE4Nu.jpg'
    WHEN title = 'Mission: Impossible - Fallout' THEN 'https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg'
    ELSE poster_url
END
WHERE title IN (
    'Barbie', '3 Idiots', 'Dangal', 'RRR', 'Baahubali 2: The Conclusion', 'Vikram', 'Get Out', 'Coco',
    'Mad Max: Fury Road', 'Jurassic World', 'Frozen', 'The Lion King', 'KGF: Chapter 2', 'Pathaan',
    'Mission: Impossible - Fallout'
);
