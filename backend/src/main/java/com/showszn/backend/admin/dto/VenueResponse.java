package com.showszn.backend.admin.dto;

import com.showszn.backend.catalog.Venue;

public record VenueResponse(Long id, String name, String address, String slug, Long cityId, String cityName) {

    public static VenueResponse from(Venue venue) {
        return new VenueResponse(
                venue.getId(),
                venue.getName(),
                venue.getAddress(),
                venue.getSlug(),
                venue.getCity().getId(),
                venue.getCity().getName());
    }
}
