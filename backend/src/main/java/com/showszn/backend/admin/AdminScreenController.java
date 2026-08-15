package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.ScreenRequest;
import com.showszn.backend.admin.dto.ScreenResponse;
import com.showszn.backend.catalog.Screen;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/venues/{venueId}/screens")
public class AdminScreenController {

    private final AdminScreenService adminScreenService;

    public AdminScreenController(AdminScreenService adminScreenService) {
        this.adminScreenService = adminScreenService;
    }

    @GetMapping
    public List<ScreenResponse> list(@PathVariable Long venueId) {
        return adminScreenService.listByVenue(venueId).stream()
                .map(screen -> ScreenResponse.from(screen, adminScreenService.seatCount(screen.getId())))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ScreenResponse create(@PathVariable Long venueId, @Valid @RequestBody ScreenRequest request) {
        Screen screen = adminScreenService.create(venueId, request);
        return ScreenResponse.from(screen, adminScreenService.seatCount(screen.getId()));
    }
}
