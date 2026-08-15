package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.ShowAdminResponse;
import com.showszn.backend.admin.dto.ShowRequest;
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
@RequestMapping("/api/admin/shows")
public class AdminShowController {

    private final AdminShowService adminShowService;

    public AdminShowController(AdminShowService adminShowService) {
        this.adminShowService = adminShowService;
    }

    @GetMapping
    public Page<ShowAdminResponse> list(
            @PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.DESC) Pageable pageable) {
        return adminShowService.listAll(pageable).map(ShowAdminResponse::from);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShowAdminResponse create(@Valid @RequestBody ShowRequest request) {
        return ShowAdminResponse.from(adminShowService.create(request));
    }
}
