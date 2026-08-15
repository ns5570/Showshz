CREATE TABLE city (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE venue (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(300) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venue_city FOREIGN KEY (city_id) REFERENCES city (id)
) ENGINE = InnoDB;

CREATE INDEX idx_venue_city_id ON venue (city_id);

CREATE TABLE screen (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venue_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_screen_venue FOREIGN KEY (venue_id) REFERENCES venue (id),
    CONSTRAINT uq_screen_venue_name UNIQUE (venue_id, name)
) ENGINE = InnoDB;

CREATE INDEX idx_screen_venue_id ON screen (venue_id);

CREATE TABLE seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    screen_id BIGINT NOT NULL,
    row_label VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    CONSTRAINT fk_seat_screen FOREIGN KEY (screen_id) REFERENCES screen (id),
    CONSTRAINT uq_seat_screen_row_number UNIQUE (screen_id, row_label, seat_number)
) ENGINE = InnoDB;

CREATE INDEX idx_seat_screen_id ON seat (screen_id);

CREATE TABLE movie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT,
    duration_minutes INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    poster_url TEXT,
    censor_rating VARCHAR(10),
    trailer_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE showtime (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    screen_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_show_movie FOREIGN KEY (movie_id) REFERENCES movie (id),
    CONSTRAINT fk_show_screen FOREIGN KEY (screen_id) REFERENCES screen (id)
) ENGINE = InnoDB;

CREATE INDEX idx_show_movie_id ON showtime (movie_id);
CREATE INDEX idx_show_screen_id_start_time ON showtime (screen_id, start_time);

CREATE TABLE show_seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    show_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT fk_show_seat_show FOREIGN KEY (show_id) REFERENCES showtime (id),
    CONSTRAINT fk_show_seat_seat FOREIGN KEY (seat_id) REFERENCES seat (id),
    CONSTRAINT uq_show_seat_show_seat UNIQUE (show_id, seat_id)
) ENGINE = InnoDB;

CREATE INDEX idx_show_seat_show_id ON show_seat (show_id);

CREATE TABLE app_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clerk_user_id VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255),
    name VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES app_user (id),
    CONSTRAINT fk_booking_show FOREIGN KEY (show_id) REFERENCES showtime (id)
) ENGINE = InnoDB;

CREATE INDEX idx_booking_user_id ON booking (user_id);

CREATE TABLE booking_seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    show_seat_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_booking_seat_booking FOREIGN KEY (booking_id) REFERENCES booking (id),
    CONSTRAINT fk_booking_seat_show_seat FOREIGN KEY (show_seat_id) REFERENCES show_seat (id),
    CONSTRAINT uq_booking_seat_show_seat UNIQUE (show_seat_id)
) ENGINE = InnoDB;

CREATE INDEX idx_booking_seat_booking_id ON booking_seat (booking_id);
