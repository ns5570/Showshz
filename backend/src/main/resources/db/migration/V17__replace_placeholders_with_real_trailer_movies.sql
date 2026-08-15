-- Every trailer_url on this site must point to a real, verified trailer for that exact
-- movie (each of the 17 YouTube video IDs below was checked one at a time via YouTube's
-- oembed API to confirm both that it resolves and that its title matches the movie).
-- Rather than adding more rows, this repurposes 17 existing placeholder movies (picked for
-- already having a full, well-populated showtime schedule) into real, well-known titles --
-- so they keep their existing showtimes/venues/screens and just get correct real-world
-- metadata and a genuinely matching trailer.
UPDATE movie
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY show_count DESC, id) - 1 AS rn
    FROM (
        SELECT m2.id, COUNT(s2.id) AS show_count
        FROM movie m2
        JOIN showtime s2 ON s2.movie_id = m2.id
        WHERE m2.trailer_url IS NULL
        GROUP BY m2.id
        ORDER BY show_count DESC, m2.id
        LIMIT 17
    ) top_candidates
) candidates ON candidates.id = movie.id
JOIN (
    SELECT 0 AS rn, 'Inception' AS title, 'inception' AS slug,
           'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.' AS description,
           148 AS duration_minutes, 'English' AS language, 'Sci-Fi' AS genre, DATE('2010-07-16') AS release_date,
           'https://picsum.photos/seed/inception/400/600' AS poster_url, 'UA' AS censor_rating,
           'https://www.youtube.com/watch?v=YoHD9XEInc0' AS trailer_url
    UNION ALL SELECT 1, 'The Dark Knight', 'the-dark-knight',
           'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.',
           152, 'English', 'Action', DATE('2008-07-18'), 'https://picsum.photos/seed/the-dark-knight/400/600', 'UA',
           'https://www.youtube.com/watch?v=EXeTwQWrcwY'
    UNION ALL SELECT 2, 'Interstellar', 'interstellar',
           'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
           169, 'English', 'Sci-Fi', DATE('2014-11-07'), 'https://picsum.photos/seed/interstellar/400/600', 'UA',
           'https://www.youtube.com/watch?v=2LqzF5WauAw'
    UNION ALL SELECT 3, 'Oppenheimer', 'oppenheimer',
           'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
           180, 'English', 'Drama', DATE('2023-07-21'), 'https://picsum.photos/seed/oppenheimer/400/600', 'A',
           'https://www.youtube.com/watch?v=keydELfWuMQ'
    UNION ALL SELECT 4, 'Barbie', 'barbie',
           'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land, until they venture out into the real world.',
           114, 'English', 'Comedy', DATE('2023-07-21'), 'https://picsum.photos/seed/barbie/400/600', 'U',
           'https://www.youtube.com/watch?v=pBk4NYhWNMM'
    UNION ALL SELECT 5, 'Dune: Part Two', 'dune-part-two',
           'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family, while facing a choice that will shape the fate of the universe.',
           166, 'English', 'Sci-Fi', DATE('2024-03-01'), 'https://picsum.photos/seed/dune-part-two/400/600', 'UA',
           'https://www.youtube.com/watch?v=WUBQdC__fC4'
    UNION ALL SELECT 6, '3 Idiots', '3-idiots',
           'Two friends search for their long-lost companion, recalling the college days and their misadventures with a rebellious, freethinking friend.',
           170, 'Hindi', 'Comedy', DATE('2009-12-25'), 'https://picsum.photos/seed/3-idiots/400/600', 'U',
           'https://www.youtube.com/watch?v=xvszmNXdM4w'
    UNION ALL SELECT 7, 'Dangal', 'dangal',
           'A former wrestler trains his daughters to become India''s first world-class female wrestlers.',
           161, 'Hindi', 'Drama', DATE('2016-12-23'), 'https://picsum.photos/seed/dangal/400/600', 'U',
           'https://www.youtube.com/watch?v=LQoXSCrTwfg'
    UNION ALL SELECT 8, 'RRR', 'rrr',
           'A fictional story about two legendary revolutionaries and their journey away from home, before they started fighting for their country in the 1920s.',
           187, 'Telugu', 'Action', DATE('2022-03-25'), 'https://picsum.photos/seed/rrr/400/600', 'UA',
           'https://www.youtube.com/watch?v=f_vbAtFSEc0'
    UNION ALL SELECT 9, 'Baahubali 2: The Conclusion', 'baahubali-2-the-conclusion',
           'When Shiva, the son of Baahubali, learns about his heritage, he begins to look for answers to why his father was betrayed and killed.',
           167, 'Telugu', 'Action', DATE('2017-04-28'), 'https://picsum.photos/seed/baahubali-2/400/600', 'UA',
           'https://www.youtube.com/watch?v=G62HrubdD6o'
    UNION ALL SELECT 10, 'Vikram', 'vikram',
           'A black ops squad investigates and hunts down a group of masked murderers, uncovering deep conspiracies along the way.',
           174, 'Tamil', 'Action', DATE('2022-06-03'), 'https://picsum.photos/seed/vikram/400/600', 'A',
           'https://www.youtube.com/watch?v=OKBMCL-frPU'
    UNION ALL SELECT 11, 'Parasite', 'parasite',
           'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
           132, 'Korean', 'Thriller', DATE('2019-10-11'), 'https://picsum.photos/seed/parasite/400/600', 'A',
           'https://www.youtube.com/watch?v=QRkBjCGJ3Uc'
    UNION ALL SELECT 12, 'Joker', 'joker',
           'In 1980s Gotham City, a failed stand-up comedian is driven insane and turns to a life of crime and chaos.',
           122, 'English', 'Drama', DATE('2019-10-04'), 'https://picsum.photos/seed/joker/400/600', 'A',
           'https://www.youtube.com/watch?v=ch0hwbiWMH4'
    UNION ALL SELECT 13, 'The Batman', 'the-batman',
           'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption.',
           176, 'English', 'Action', DATE('2022-03-04'), 'https://picsum.photos/seed/the-batman/400/600', 'UA',
           'https://www.youtube.com/watch?v=_8xDtjlR3ek'
    UNION ALL SELECT 14, 'Spider-Man: No Way Home', 'spider-man-no-way-home',
           'With Spider-Man''s identity revealed, Peter asks Doctor Strange for help -- a spell gone wrong brings villains from other universes.',
           148, 'English', 'Action', DATE('2021-12-17'), 'https://picsum.photos/seed/spider-man-no-way-home/400/600', 'UA',
           'https://www.youtube.com/watch?v=JfVOs4VSpmA'
    UNION ALL SELECT 15, 'Get Out', 'get-out',
           'A young African-American man visits his white girlfriend''s family estate, where he becomes ensnared in a more sinister real reason for the invitation.',
           104, 'English', 'Horror', DATE('2017-02-24'), 'https://picsum.photos/seed/get-out/400/600', 'A',
           'https://www.youtube.com/watch?v=AHEl7Pji0f8'
    UNION ALL SELECT 16, 'Coco', 'coco',
           'Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer, and uncover the truth about his family.',
           105, 'English', 'Animation', DATE('2017-11-22'), 'https://picsum.photos/seed/coco/400/600', 'U',
           'https://www.youtube.com/watch?v=jjudmcSxzpc'
) new_data ON new_data.rn = candidates.rn
SET
    movie.title = new_data.title,
    movie.slug = new_data.slug,
    movie.description = new_data.description,
    movie.duration_minutes = new_data.duration_minutes,
    movie.language = new_data.language,
    movie.genre = new_data.genre,
    movie.release_date = new_data.release_date,
    movie.poster_url = new_data.poster_url,
    movie.censor_rating = new_data.censor_rating,
    movie.trailer_url = new_data.trailer_url;
