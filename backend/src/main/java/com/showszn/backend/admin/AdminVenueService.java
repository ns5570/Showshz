package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.VenueRequest;
import com.showszn.backend.catalog.City;
import com.showszn.backend.catalog.CityRepository;
import com.showszn.backend.catalog.Venue;
import com.showszn.backend.catalog.VenueRepository;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminVenueService {

    private final VenueRepository venueRepository;
    private final CityRepository cityRepository;

    public AdminVenueService(VenueRepository venueRepository, CityRepository cityRepository) {
        this.venueRepository = venueRepository;
        this.cityRepository = cityRepository;
    }

    @Transactional(readOnly = true)
    public Page<Venue> listAll(Pageable pageable) {
        return venueRepository.findAllWithCity(pageable);
    }

    public Venue create(VenueRequest request) {
        City city = cityRepository.findById(request.cityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found: " + request.cityId()));

        Venue venue = Venue.builder()
                .city(city)
                .name(request.name())
                .address(request.address())
                .slug(request.slug())
                .createdAt(Instant.now())
                .build();
        return venueRepository.save(venue);
    }
}
