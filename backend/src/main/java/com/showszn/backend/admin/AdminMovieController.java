package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.MovieRequest;
import com.showszn.backend.admin.dto.MovieWithShowsRequest;
import com.showszn.backend.admin.dto.MovieWithShowsResponse;
import com.showszn.backend.admin.dto.ShowAdminResponse;
import com.showszn.backend.catalog.dto.MovieDetailResponse;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/admin/movies")
public class AdminMovieController {

    private final AdminMovieService adminMovieService;

    public AdminMovieController(AdminMovieService adminMovieService) {
        this.adminMovieService = adminMovieService;
    }

    @GetMapping
    public Page<MovieDetailResponse> list(@PageableDefault(size = 20, sort = "title") Pageable pageable) {
        return adminMovieService.listAll(pageable).map(MovieDetailResponse::from);
    }

    @GetMapping("/all")
    public List<MovieDetailResponse> listAll() {
        return adminMovieService.listAllUnpaged().stream().map(MovieDetailResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovieDetailResponse create(@Valid @RequestBody MovieRequest request) {
        return MovieDetailResponse.from(adminMovieService.create(request));
    }

    @PostMapping("/with-shows")
    @ResponseStatus(HttpStatus.CREATED)
    public MovieWithShowsResponse createWithShows(@Valid @RequestBody MovieWithShowsRequest request) {
        AdminMovieService.MovieWithShows result = adminMovieService.createWithShows(request);
        return new MovieWithShowsResponse(
                MovieDetailResponse.from(result.movie()),
                result.shows().stream().map(ShowAdminResponse::from).toList());
    }

    @PutMapping("/{movieId}")
    public MovieDetailResponse update(@PathVariable Long movieId, @Valid @RequestBody MovieRequest request) {
        return MovieDetailResponse.from(adminMovieService.update(movieId, request));
    }

    @DeleteMapping("/{movieId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long movieId) {
        adminMovieService.delete(movieId);
    }
}
