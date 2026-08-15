package com.showszn.backend.admin.dto;

import com.showszn.backend.catalog.Screen;

public record ScreenResponse(Long id, String name, Long venueId, int seatCount) {

    public static ScreenResponse from(Screen screen, int seatCount) {
        return new ScreenResponse(screen.getId(), screen.getName(), screen.getVenue().getId(), seatCount);
    }
}
