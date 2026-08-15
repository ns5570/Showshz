package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.EventShowAdminResponse;
import com.showszn.backend.admin.dto.EventShowRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/event-shows")
public class AdminEventShowController {

    private final AdminEventShowService adminEventShowService;

    public AdminEventShowController(AdminEventShowService adminEventShowService) {
        this.adminEventShowService = adminEventShowService;
    }

    @GetMapping
    public Page<EventShowAdminResponse> list(
            @PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.DESC) Pageable pageable) {
        return adminEventShowService.listAll(pageable).map(EventShowAdminResponse::from);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventShowAdminResponse create(@Valid @RequestBody EventShowRequest request) {
        return EventShowAdminResponse.from(adminEventShowService.create(request));
    }
}
