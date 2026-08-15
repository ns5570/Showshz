-- Multiple seed migrations re-inserted the same catalog titles as new rows instead of
-- upserting, leaving up to 11 duplicate `movie` rows per title (identical poster,
-- duration, rating and release date, just an auto-suffixed slug). This consolidates
-- each duplicate group onto one canonical row, repointing their showtimes rather than
-- deleting them so existing bookings (which reference showtime.id, never movie.id)
-- stay intact.
--
-- Everything (including the temp-table setup) runs inside one stored procedure guarded
-- by an exit handler: on a production database with very little free disk, even a small
-- CREATE TEMPORARY TABLE can fail with "table is full" or an undo-log-space error. A
-- hard failure here leaves Flyway refusing to start the app at all on every subsequent
-- boot until manually repaired -- far worse than leaving some duplicates for a later,
-- better-provisioned run. The handler rolls back whatever was uncommitted and lets the
-- migration complete successfully with however much it managed to merge (including
-- possibly nothing, if there is truly no room).

DROP PROCEDURE IF EXISTS dedupe_movies;

DELIMITER $$

CREATE PROCEDURE dedupe_movies()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_old_id BIGINT;
    DECLARE v_canonical_id BIGINT;
    DECLARE cur CURSOR FOR SELECT old_id, canonical_id FROM movie_dupe_map;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        DROP TEMPORARY TABLE IF EXISTS movie_eligible;
        DROP TEMPORARY TABLE IF EXISTS movie_canonical;
        DROP TEMPORARY TABLE IF EXISTS movie_dupe_map;
    END;

    CREATE TEMPORARY TABLE movie_eligible AS
    SELECT title FROM movie
    GROUP BY title
    HAVING COUNT(*) > 1
       AND COUNT(DISTINCT poster_url) = 1
       AND COUNT(DISTINCT duration_minutes) = 1
       AND COUNT(DISTINCT COALESCE(censor_rating, '')) = 1
       AND COUNT(DISTINCT release_date) = 1;

    CREATE TEMPORARY TABLE movie_canonical AS
    SELECT title, id AS canonical_id FROM (
        SELECT m.id, m.title,
            ROW_NUMBER() OVER (
                PARTITION BY m.title
                ORDER BY (m.trailer_url IS NOT NULL AND m.trailer_url <> '') DESC,
                         (m.description IS NOT NULL AND m.description <> '') DESC,
                         m.id ASC
            ) AS rn
        FROM movie m
        JOIN movie_eligible e ON e.title = m.title
    ) ranked
    WHERE rn = 1;

    CREATE TEMPORARY TABLE movie_dupe_map AS
    SELECT m.id AS old_id, mc.canonical_id AS canonical_id
    FROM movie m
    JOIN movie_canonical mc ON mc.title = m.title
    WHERE m.id <> mc.canonical_id;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_old_id, v_canonical_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        UPDATE showtime SET movie_id = v_canonical_id WHERE movie_id = v_old_id;
        DELETE FROM movie WHERE id = v_old_id;
        COMMIT;
    END LOOP;
    CLOSE cur;

    DROP TEMPORARY TABLE movie_eligible;
    DROP TEMPORARY TABLE movie_canonical;
    DROP TEMPORARY TABLE movie_dupe_map;
END$$

DELIMITER ;

CALL dedupe_movies();

DROP PROCEDURE dedupe_movies;
