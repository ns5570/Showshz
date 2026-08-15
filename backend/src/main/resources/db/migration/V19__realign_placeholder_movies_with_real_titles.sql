-- The generated 2027/upcoming placeholder rows were still shipping with random adjective-title
-- names, Picsum placeholders, and no real trailer metadata. Re-map those rows to a curated set
-- of real releases so the catalogue stays consistent with the rest of the app.
UPDATE movie m
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS rn
    FROM movie
    WHERE poster_url LIKE 'https://picsum.photos/seed/movie2027-%'
       OR poster_url LIKE 'https://picsum.photos/seed/upcoming-%'
) placeholder ON placeholder.id = m.id
JOIN (
    SELECT 0 AS rn, 'Inception' AS title, 'inception' AS slug,
           'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.' AS description,
           148 AS duration_minutes, 'English' AS language, 'Sci-Fi' AS genre, DATE('2010-07-16') AS release_date,
           'https://picsum.photos/seed/inception/400/600' AS poster_url, 'UA' AS censor_rating,
           'https://www.youtube.com/watch?v=YoHD9XEInc0' AS trailer_url
    UNION ALL SELECT 1, 'The Dark Knight', 'the-dark-knight',
           'When the menace known as the Joker wreaks havoc on Gotham, Batman must confront one of the greatest psychological tests of his ability to fight injustice.',
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
    UNION ALL SELECT 4, 'Dune: Part Two', 'dune-part-two',
           'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family while facing a choice that will shape the fate of the universe.',
           166, 'English', 'Sci-Fi', DATE('2024-03-01'), 'https://picsum.photos/seed/dune-part-two/400/600', 'UA',
           'https://www.youtube.com/watch?v=WUBQdC__fC4'
    UNION ALL SELECT 5, 'Barbie', 'barbie',
           'Barbie and Ken are having the time of their lives in the colorful world of Barbie Land until they venture into the real world.',
           114, 'English', 'Comedy', DATE('2023-07-21'), 'https://picsum.photos/seed/barbie/400/600', 'U',
           'https://www.youtube.com/watch?v=pBk4NYhWNMM'
    UNION ALL SELECT 6, '3 Idiots', '3-idiots',
           'Two friends search for their long-lost companion and revisit the madness of their college years with a rebellious, freethinking friend.',
           170, 'Hindi', 'Comedy', DATE('2009-12-25'), 'https://picsum.photos/seed/3-idiots/400/600', 'U',
           'https://www.youtube.com/watch?v=xvszmNXdM4w'
    UNION ALL SELECT 7, 'Dangal', 'dangal',
           'A former wrestler trains his daughters to become India''s first world-class female wrestlers.',
           161, 'Hindi', 'Drama', DATE('2016-12-23'), 'https://picsum.photos/seed/dangal/400/600', 'U',
           'https://www.youtube.com/watch?v=LQoXSCrTwfg'
    UNION ALL SELECT 8, 'RRR', 'rrr',
           'A fictional story about two legendary revolutionaries and their journey away from home before they began fighting for their country.',
           187, 'Telugu', 'Action', DATE('2022-03-25'), 'https://picsum.photos/seed/rrr/400/600', 'UA',
           'https://www.youtube.com/watch?v=f_vbAtFSEc0'
    UNION ALL SELECT 9, 'Baahubali 2: The Conclusion', 'baahubali-2-the-conclusion',
           'When Shiva learns about his heritage, he begins looking for answers behind his father''s betrayal and death.',
           167, 'Telugu', 'Action', DATE('2017-04-28'), 'https://picsum.photos/seed/baahubali-2/400/600', 'UA',
           'https://www.youtube.com/watch?v=G62HrubdD6o'
    UNION ALL SELECT 10, 'Vikram', 'vikram',
           'A black ops squad investigates masked murderers and uncovers a conspiracy that reaches deep into the system.',
           174, 'Tamil', 'Action', DATE('2022-06-03'), 'https://picsum.photos/seed/vikram/400/600', 'A',
           'https://www.youtube.com/watch?v=OKBMCL-frPU'
    UNION ALL SELECT 11, 'Parasite', 'parasite',
           'Greed and class discrimination threaten the new alliance between a wealthy family and a destitute one.',
           132, 'Korean', 'Thriller', DATE('2019-10-11'), 'https://picsum.photos/seed/parasite/400/600', 'A',
           'https://www.youtube.com/watch?v=QRkBjCGJ3Uc'
    UNION ALL SELECT 12, 'Joker', 'joker',
           'In 1980s Gotham City, a failed stand-up comedian descends into madness and a life of crime.',
           122, 'English', 'Drama', DATE('2019-10-04'), 'https://picsum.photos/seed/joker/400/600', 'A',
           'https://www.youtube.com/watch?v=ch0hwbiWMH4'
    UNION ALL SELECT 13, 'The Batman', 'the-batman',
           'When a serial killer begins murdering key political figures, Batman must investigate Gotham''s hidden corruption.',
           176, 'English', 'Action', DATE('2022-03-04'), 'https://picsum.photos/seed/the-batman/400/600', 'UA',
           'https://www.youtube.com/watch?v=_8xDtjlR3ek'
    UNION ALL SELECT 14, 'Spider-Man: No Way Home', 'spider-man-no-way-home',
           'With Spider-Man''s identity revealed, Peter asks Doctor Strange for help, but a spell gone wrong pulls in villains from other universes.',
           148, 'English', 'Action', DATE('2021-12-17'), 'https://picsum.photos/seed/spider-man-no-way-home/400/600', 'UA',
           'https://www.youtube.com/watch?v=JfVOs4VSpmA'
    UNION ALL SELECT 15, 'Get Out', 'get-out',
           'A young African-American man visits his white girlfriend''s family estate and discovers a sinister truth.',
           104, 'English', 'Horror', DATE('2017-02-24'), 'https://picsum.photos/seed/get-out/400/600', 'A',
           'https://www.youtube.com/watch?v=AHEl7Pji0f8'
    UNION ALL SELECT 16, 'Coco', 'coco',
           'Aspiring musician Miguel enters the Land of the Dead to uncover the truth about his family and his future.',
           105, 'English', 'Animation', DATE('2017-11-22'), 'https://picsum.photos/seed/coco/400/600', 'U',
           'https://www.youtube.com/watch?v=jjudmcSxzpc'
    UNION ALL SELECT 17, 'Avengers: Endgame', 'avengers-endgame',
           'The Avengers assemble for the ultimate showdown with Thanos as the fate of the universe hangs in the balance.',
           181, 'English', 'Action', DATE('2019-04-26'), 'https://picsum.photos/seed/avengers-endgame/400/600', 'UA',
           'https://www.youtube.com/watch?v=TcMBFSGVi1c'
    UNION ALL SELECT 18, 'Avatar: The Way of Water', 'avatar-the-way-of-water',
           'Jake Sully and Neytiri face new challenges and a deepening bond as they protect their family in Pandora.',
           192, 'English', 'Sci-Fi', DATE('2022-12-16'), 'https://picsum.photos/seed/avatar-the-way-of-water/400/600', 'UA',
           'https://www.youtube.com/watch?v=d9MyW72ELq0'
    UNION ALL SELECT 19, 'Top Gun: Maverick', 'top-gun-maverick',
           'After more than thirty years, Maverick returns to teach a new generation of fighter pilots.',
           131, 'English', 'Action', DATE('2022-05-27'), 'https://picsum.photos/seed/top-gun-maverick/400/600', 'UA',
           'https://www.youtube.com/watch?v=giXco2jaZ_4'
    UNION ALL SELECT 20, 'Titanic', 'titanic',
           'A poor artist and a wealthy young woman fall in love aboard the luxury liner Titanic.',
           194, 'English', 'Romance', DATE('1997-12-19'), 'https://picsum.photos/seed/titanic/400/600', 'U',
           'https://www.youtube.com/watch?v=CHekzSiZjrY'
    UNION ALL SELECT 21, 'Mad Max: Fury Road', 'mad-max-fury-road',
           'In a post-apocalyptic wasteland, Max and Furiosa flee a tyrannical ruler in a thrilling desert chase.',
           120, 'English', 'Action', DATE('2015-05-15'), 'https://picsum.photos/seed/mad-max-fury-road/400/600', 'A',
           'https://www.youtube.com/watch?v=hEJnMQG9ev8'
    UNION ALL SELECT 22, 'Jurassic World', 'jurassic-world',
           'A genetically engineered dinosaur theme park fails catastrophically when the creatures escape.',
           124, 'English', 'Adventure', DATE('2015-06-12'), 'https://picsum.photos/seed/jurassic-world/400/600', 'UA',
           'https://www.youtube.com/watch?v=RFinNxS5KN4'
    UNION ALL SELECT 23, 'Frozen', 'frozen',
           'Fearless optimist Anna sets off on an epic journey to find her sister Elsa and restore the kingdom.''s peace.',
           102, 'English', 'Animation', DATE('2013-11-27'), 'https://picsum.photos/seed/frozen/400/600', 'U',
           'https://www.youtube.com/watch?v=TbQm5doF_Uc'
    UNION ALL SELECT 24, 'The Lion King', 'the-lion-king',
           'A young lion prince is forced into exile and must reclaim his place as king.',
           118, 'English', 'Animation', DATE('2019-07-19'), 'https://picsum.photos/seed/the-lion-king/400/600', 'U',
           'https://www.youtube.com/watch?v=7TavVZMewpY'
    UNION ALL SELECT 25, 'La La Land', 'la-la-land',
           'A jazz pianist and an aspiring actress chase their dreams in modern-day Los Angeles.',
           128, 'English', 'Drama', DATE('2016-12-09'), 'https://picsum.photos/seed/la-la-land/400/600', 'U',
           'https://www.youtube.com/watch?v=0pdqf4P9MB8'
    UNION ALL SELECT 26, 'KGF: Chapter 2', 'kgf-chapter-2',
           'Rocky is back in a battle against the dreaded dons and the corrupt system that rules the world.',
           167, 'Kannada', 'Action', DATE('2022-04-14'), 'https://picsum.photos/seed/kgf-chapter-2/400/600', 'UA',
           'https://www.youtube.com/watch?v=Qah9sSIXJqk'
    UNION ALL SELECT 27, 'Pathaan', 'pathaan',
           'An exiled RAW agent returns to protect the country from a dangerous threat while fighting his own past.',
           146, 'Hindi', 'Action', DATE('2023-01-25'), 'https://picsum.photos/seed/pathaan/400/600', 'UA',
           'https://www.youtube.com/watch?v=vqu4z34wENw'
    UNION ALL SELECT 28, 'Mission: Impossible - Fallout', 'mission-impossible-fallout',
           'Ethan Hunt faces a deadly mission in a race against time to prevent a nuclear catastrophe.',
           147, 'English', 'Action', DATE('2018-07-27'), 'https://picsum.photos/seed/mission-impossible-fallout/400/600', 'UA',
           'https://www.youtube.com/watch?v=wb49-oV0F78'
    UNION ALL SELECT 29, 'The Avengers', 'the-avengers',
           'When an unexpected force threatens Earth, Nick Fury assembles a team of heroes to save the world.',
           143, 'English', 'Action', DATE('2012-05-04'), 'https://picsum.photos/seed/the-avengers/400/600', 'UA',
           'https://www.youtube.com/watch?v=eOrNdBpGMv8'
) new_data ON new_data.rn = MOD(placeholder.rn, 30)
SET
    m.title = new_data.title,
    m.slug = CONCAT(new_data.slug, '-', placeholder.rn + 1),
    m.description = new_data.description,
    m.duration_minutes = new_data.duration_minutes,
    m.language = new_data.language,
    m.genre = new_data.genre,
    m.release_date = new_data.release_date,
    m.poster_url = new_data.poster_url,
    m.censor_rating = new_data.censor_rating,
    m.trailer_url = new_data.trailer_url;
