package com.showszn.backend.event;

import com.showszn.backend.catalog.City;
import com.showszn.backend.catalog.CityRepository;
import com.showszn.backend.event.dto.EventDetailResponse;
import com.showszn.backend.event.dto.EventShowResponse;
import com.showszn.backend.event.dto.EventSummaryResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventCatalogService {

    private static final ZoneId DISPLAY_ZONE = ZoneId.of("Asia/Kolkata");

    private final EventRepository eventRepository;
    private final EventShowRepository eventShowRepository;
    private final CityRepository cityRepository;

    public EventCatalogService(EventRepository eventRepository, EventShowRepository eventShowRepository, CityRepository cityRepository) {
        this.eventRepository = eventRepository;
        this.eventShowRepository = eventShowRepository;
        this.cityRepository = cityRepository;
    }

    @Cacheable(value = "eventsByCity", key = "#cityId + '-' + #category")
    public List<EventSummaryResponse> listEvents(Long cityId, String category) {
        requireCity(cityId);
        List<String> categories = category == null
                ? List.of()
                : java.util.Arrays.stream(category.split(","))
                        .map(String::trim)
                        .filter(c -> !c.isEmpty())
                        .toList();

        List<Event> events;
        if (categories.isEmpty()) {
            events = eventRepository.findWithUpcomingShowsInCity(cityId, Instant.now());
        } else if (categories.size() == 1) {
            events = eventRepository.findWithUpcomingShowsInCityAndCategory(cityId, categories.get(0), Instant.now());
        } else {
            events = eventRepository.findWithUpcomingShowsInCityAndCategories(cityId, categories, Instant.now());
        }
        return events.stream().map(EventSummaryResponse::from).toList();
    }

    public EventDetailResponse getEvent(Long eventId) {
        return EventDetailResponse.from(requireEvent(eventId));
    }

    public List<EventShowResponse> listEventShows(Long eventId, Long cityId, LocalDate date) {
        requireEvent(eventId);
        requireCity(cityId);

        Instant from = date.atStartOfDay(DISPLAY_ZONE).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(DISPLAY_ZONE).toInstant();

        return eventShowRepository.findByEventAndCityAndDateRange(eventId, cityId, from, to).stream()
                .map(EventShowResponse::from)
                .toList();
    }

    private City requireCity(Long cityId) {
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found: " + cityId));
    }

    private Event requireEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found: " + eventId));
    }
}
