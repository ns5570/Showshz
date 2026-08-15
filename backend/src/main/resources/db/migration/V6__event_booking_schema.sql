-- Clear old shape (venue_name/event_date/price move to event_show); dev data only, safe to reseed
DELETE FROM event;

ALTER TABLE event ADD COLUMN slug VARCHAR(220) NOT NULL UNIQUE;
ALTER TABLE event ADD COLUMN duration_minutes INT;
ALTER TABLE event DROP FOREIGN KEY fk_event_city;
ALTER TABLE event DROP COLUMN city_id;
ALTER TABLE event DROP COLUMN venue_name;
ALTER TABLE event DROP COLUMN event_date;
ALTER TABLE event DROP COLUMN price;

CREATE TABLE event_show (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    screen_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_show_event FOREIGN KEY (event_id) REFERENCES event (id),
    CONSTRAINT fk_event_show_screen FOREIGN KEY (screen_id) REFERENCES screen (id)
) ENGINE = InnoDB;

CREATE INDEX idx_event_show_event_id ON event_show (event_id);
CREATE INDEX idx_event_show_screen_id_start_time ON event_show (screen_id, start_time);

CREATE TABLE event_show_seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_show_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT fk_event_show_seat_event_show FOREIGN KEY (event_show_id) REFERENCES event_show (id),
    CONSTRAINT fk_event_show_seat_seat FOREIGN KEY (seat_id) REFERENCES seat (id),
    CONSTRAINT uq_event_show_seat_show_seat UNIQUE (event_show_id, seat_id)
) ENGINE = InnoDB;

CREATE INDEX idx_event_show_seat_event_show_id ON event_show_seat (event_show_id);

CREATE TABLE event_booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    event_show_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_booking_user FOREIGN KEY (user_id) REFERENCES app_user (id),
    CONSTRAINT fk_event_booking_event_show FOREIGN KEY (event_show_id) REFERENCES event_show (id)
) ENGINE = InnoDB;

CREATE INDEX idx_event_booking_user_id ON event_booking (user_id);

CREATE TABLE event_booking_seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_booking_id BIGINT NOT NULL,
    event_show_seat_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_event_booking_seat_booking FOREIGN KEY (event_booking_id) REFERENCES event_booking (id),
    CONSTRAINT fk_event_booking_seat_show_seat FOREIGN KEY (event_show_seat_id) REFERENCES event_show_seat (id),
    CONSTRAINT uq_event_booking_seat_show_seat UNIQUE (event_show_seat_id)
) ENGINE = InnoDB;

CREATE INDEX idx_event_booking_seat_booking_id ON event_booking_seat (event_booking_id);
