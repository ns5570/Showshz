CREATE TABLE movie_genre (
    movie_id BIGINT NOT NULL,
    genre VARCHAR(30) NOT NULL,
    CONSTRAINT fk_movie_genre_movie FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre)
);

CREATE TABLE movie_language (
    movie_id BIGINT NOT NULL,
    language VARCHAR(30) NOT NULL,
    CONSTRAINT fk_movie_language_movie FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, language)
);

INSERT INTO movie_language (movie_id, language)
SELECT id, UPPER(language) FROM movie;

INSERT INTO movie_genre (movie_id, genre)
SELECT id, 'SCI_FI' FROM movie WHERE genre IN ('Sci-Fi', 'Sci-Fi Comedy');

INSERT INTO movie_genre (movie_id, genre)
SELECT id, 'COMEDY' FROM movie WHERE genre = 'Sci-Fi Comedy';

INSERT INTO movie_genre (movie_id, genre)
SELECT id, UPPER(genre) FROM movie WHERE genre NOT IN ('Sci-Fi', 'Sci-Fi Comedy');

ALTER TABLE movie DROP COLUMN genre;
ALTER TABLE movie DROP COLUMN language;
