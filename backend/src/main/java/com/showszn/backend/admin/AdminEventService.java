package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.EventRequest;
import com.showszn.backend.event.Event;
import com.showszn.backend.event.EventRepository;
import java.time.Instant;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminEventService {

    private final EventRepository eventRepository;

    public AdminEventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Page<Event> listAll(Pageable pageable) {
        return eventRepository.findAllPaged(pageable);
    }

    @CacheEvict(value = "eventsByCity", allEntries = true)
    public Event create(EventRequest request) {
        Event event = Event.builder()
                .title(request.title())
                .slug(request.slug())
                .category(request.category())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .durationMinutes(request.durationMinutes())
                .createdAt(Instant.now())
                .build();
        return eventRepository.save(event);
    }

    @CacheEvict(value = "eventsByCity", allEntries = true)
    public Event update(Long eventId, EventRequest request) {
        Event event = requireEvent(eventId);
        event.setTitle(request.title());
        event.setSlug(request.slug());
        event.setCategory(request.category());
        event.setDescription(request.description());
        event.setImageUrl(request.imageUrl());
        event.setDurationMinutes(request.durationMinutes());
        return eventRepository.save(event);
    }

    @CacheEvict(value = "eventsByCity", allEntries = true)
    public void delete(Long eventId) {
        requireEvent(eventId);
        eventRepository.deleteById(eventId);
    }

    private Event requireEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found: " + eventId));
    }
}
