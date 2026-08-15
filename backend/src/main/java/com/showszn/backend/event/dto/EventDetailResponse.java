package com.showszn.backend.event.dto;

import com.showszn.backend.event.Event;

public record EventDetailResponse(
        Long id, String title, String slug, String category, String description, String imageUrl, Integer durationMinutes) {

    public static EventDetailResponse from(Event event) {
        return new EventDetailResponse(
                event.getId(),
                event.getTitle(),
                event.getSlug(),
                event.getCategory(),
                event.getDescription(),
                event.getImageUrl(),
                event.getDurationMinutes());
    }
}
