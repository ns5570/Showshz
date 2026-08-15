-- Every movie should have a playable trailer. The 200 generated 2027 movies were seeded
-- without one; backfill by cycling through the existing set of real, freely-licensed
-- trailer URLs (Blender Foundation open movies) rather than fabricating broken links.
UPDATE movie m
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS rn
    FROM movie
    WHERE trailer_url IS NULL OR trailer_url = ''
) AS missing ON missing.id = m.id
JOIN (
    SELECT 0 AS idx, 'https://www.youtube.com/watch?v=YE7VzlLtp-4' AS url UNION ALL
    SELECT 1, 'https://www.youtube.com/watch?v=eRsGyueVLvQ' UNION ALL
    SELECT 2, 'https://www.youtube.com/watch?v=R6MlUcmOul8' UNION ALL
    SELECT 3, 'https://www.youtube.com/watch?v=Y-rmzh0PI3c' UNION ALL
    SELECT 4, 'https://www.youtube.com/watch?v=WhWc3b3KhnY' UNION ALL
    SELECT 5, 'https://www.youtube.com/watch?v=TLkA0RELQ1g' UNION ALL
    SELECT 6, 'https://www.youtube.com/watch?v=Ehcmk3NJneI' UNION ALL
    SELECT 7, 'https://www.youtube.com/watch?v=UXqq0ZvbOnk'
) AS trailers ON trailers.idx = MOD(missing.rn, 8)
SET m.trailer_url = trailers.url;
