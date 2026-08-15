package com.showszn.backend.booking;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SeatConflictException extends ResponseStatusException {

    public SeatConflictException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
