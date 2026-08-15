package com.showszn.backend.catalog.dto;

import com.showszn.backend.catalog.Venue;
import java.util.List;

public record SearchResponse(List<MovieSummaryResponse> movies, List<VenueResult> venues) {

    public record VenueResult(Long id, String name, String cityName, Long cityId) {
        public static VenueResult from(Venue venue) {
            return new VenueResult(venue.getId(), venue.getName(), venue.getCity().getName(), venue.getCity().getId());
        }
    }
}
