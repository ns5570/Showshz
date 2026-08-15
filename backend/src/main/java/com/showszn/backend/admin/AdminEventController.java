package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.EventRequest;
import com.showszn.backend.event.dto.EventDetailResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final AdminEventService adminEventService;

    public AdminEventController(AdminEventService adminEventService) {
        this.adminEventService = adminEventService;
    }

    @GetMapping
    public Page<EventDetailResponse> list(@PageableDefault(size = 20, sort = "title") Pageable pageable) {
        return adminEventService.listAll(pageable).map(EventDetailResponse::from);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventDetailResponse create(@Valid @RequestBody EventRequest request) {
        return EventDetailResponse.from(adminEventService.create(request));
    }

    @PutMapping("/{eventId}")
    public EventDetailResponse update(@PathVariable Long eventId, @Valid @RequestBody EventRequest request) {
        return EventDetailResponse.from(adminEventService.update(eventId, request));
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long eventId) {
        adminEventService.delete(eventId);
    }
}
