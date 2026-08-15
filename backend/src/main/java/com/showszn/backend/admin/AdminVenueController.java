package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.VenueRequest;
import com.showszn.backend.admin.dto.VenueResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/venues")
public class AdminVenueController {

    private final AdminVenueService adminVenueService;

    public AdminVenueController(AdminVenueService adminVenueService) {
        this.adminVenueService = adminVenueService;
    }

    @GetMapping
    public Page<VenueResponse> list(@PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return adminVenueService.listAll(pageable).map(VenueResponse::from);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VenueResponse create(@Valid @RequestBody VenueRequest request) {
        return VenueResponse.from(adminVenueService.create(request));
    }
}
