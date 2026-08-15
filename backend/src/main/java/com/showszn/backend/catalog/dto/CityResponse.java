package com.showszn.backend.catalog.dto;

import com.showszn.backend.catalog.City;
import java.math.BigDecimal;

public record CityResponse(
        Long id, String name, String state, String slug, BigDecimal latitude, BigDecimal longitude) {

    public static CityResponse from(City city) {
        return new CityResponse(
                city.getId(), city.getName(), city.getState(), city.getSlug(), city.getLatitude(), city.getLongitude());
    }
}
