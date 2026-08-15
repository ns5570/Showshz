package com.showszn.backend.catalog;

import com.showszn.backend.catalog.dto.CityResponse;
import com.showszn.backend.catalog.dto.MovieDetailResponse;
import com.showszn.backend.catalog.dto.MovieSummaryResponse;
import com.showszn.backend.catalog.dto.SearchResponse;
import com.showszn.backend.catalog.dto.ShowResponse;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/cities")
    public List<CityResponse> cities() {
        return catalogService.listCities();
    }

    @GetMapping("/movies")
    public List<MovieSummaryResponse> movies(@RequestParam Long cityId) {
        return catalogService.listMoviesForCity(cityId);
    }

    @GetMapping("/movies/{movieId}")
    public MovieDetailResponse movie(@PathVariable Long movieId) {
        return catalogService.getMovie(movieId);
    }

    @GetMapping("/movies/{movieId}/shows")
    public List<ShowResponse> shows(
            @PathVariable Long movieId,
            @RequestParam Long cityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return catalogService.listShowsForMovieInCity(movieId, cityId, date);
    }

    @GetMapping("/search")
    public SearchResponse search(@RequestParam String q) {
        return catalogService.search(q);
    }
}
