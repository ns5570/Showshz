CREATE TABLE booking_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_feedback_booking FOREIGN KEY (booking_id) REFERENCES booking (id),
    CONSTRAINT uq_booking_feedback_booking UNIQUE (booking_id),
    CONSTRAINT chk_booking_feedback_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE = InnoDB;

CREATE TABLE event_booking_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_booking_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_booking_feedback_booking FOREIGN KEY (event_booking_id) REFERENCES event_booking (id),
    CONSTRAINT uq_event_booking_feedback_booking UNIQUE (event_booking_id),
    CONSTRAINT chk_event_booking_feedback_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE = InnoDB;
