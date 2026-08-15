package com.showszn.backend.event;

import com.showszn.backend.event.dto.EventShowSeatMapResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/event-shows")
public class EventSeatMapController {

    private final EventSeatMapService eventSeatMapService;

    public EventSeatMapController(EventSeatMapService eventSeatMapService) {
        this.eventSeatMapService = eventSeatMapService;
    }

    @GetMapping("/{eventShowId}/seat-map")
    public EventShowSeatMapResponse getSeatMap(@PathVariable Long eventShowId) {
        return eventSeatMapService.getSeatMap(eventShowId);
    }
}
