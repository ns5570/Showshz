package com.showszn.backend.event.dto;

import com.showszn.backend.event.Event;

public record EventSummaryResponse(Long id, String title, String slug, String category, String imageUrl) {

    public static EventSummaryResponse from(Event event) {
        return new EventSummaryResponse(event.getId(), event.getTitle(), event.getSlug(), event.getCategory(), event.getImageUrl());
    }
}
