package com.showszn.backend.event;

import com.showszn.backend.event.dto.EventDetailResponse;
import com.showszn.backend.event.dto.EventShowResponse;
import com.showszn.backend.event.dto.EventSummaryResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/events")
public class EventController {

    private final EventCatalogService eventCatalogService;

    public EventController(EventCatalogService eventCatalogService) {
        this.eventCatalogService = eventCatalogService;
    }

    @GetMapping
    public List<EventSummaryResponse> list(@RequestParam Long cityId, @RequestParam(required = false) String category) {
        return eventCatalogService.listEvents(cityId, category);
    }

    @GetMapping("/{eventId}")
    public EventDetailResponse event(@PathVariable Long eventId) {
        return eventCatalogService.getEvent(eventId);
    }

    @GetMapping("/{eventId}/shows")
    public List<EventShowResponse> shows(
            @PathVariable Long eventId,
            @RequestParam Long cityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return eventCatalogService.listEventShows(eventId, cityId, date);
    }
}
