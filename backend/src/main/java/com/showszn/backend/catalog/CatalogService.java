package com.showszn.backend.catalog;

import com.showszn.backend.catalog.dto.CityResponse;
import com.showszn.backend.catalog.dto.MovieDetailResponse;
import com.showszn.backend.catalog.dto.MovieSummaryResponse;
import com.showszn.backend.catalog.dto.SearchResponse;
import com.showszn.backend.catalog.dto.ShowResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CatalogService {

    private static final ZoneId DISPLAY_ZONE = ZoneId.of("Asia/Kolkata");
    private static final Duration NOW_SHOWING_WINDOW = Duration.ofDays(14);

    private final CityRepository cityRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final VenueRepository venueRepository;

    public CatalogService(
            CityRepository cityRepository,
            MovieRepository movieRepository,
            ShowRepository showRepository,
            VenueRepository venueRepository) {
        this.cityRepository = cityRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.venueRepository = venueRepository;
    }

    public SearchResponse search(String query) {
        if (query == null || query.isBlank()) {
            return new SearchResponse(List.of(), List.of());
        }
        List<MovieSummaryResponse> movies = movieRepository.findTop10ByTitleContainingIgnoreCase(query).stream()
                .map(MovieSummaryResponse::from)
                .toList();
        List<SearchResponse.VenueResult> venues = venueRepository.searchByName(query).stream()
                .map(SearchResponse.VenueResult::from)
                .toList();
        return new SearchResponse(movies, venues);
    }

    @Cacheable("cities")
    public List<CityResponse> listCities() {
        return cityRepository.findAll().stream().map(CityResponse::from).toList();
    }

    @Cacheable(value = "moviesByCity", key = "#cityId")
    public List<MovieSummaryResponse> listMoviesForCity(Long cityId) {
        requireCity(cityId);
        Instant now = Instant.now();
        return showRepository.findMoviesWithUpcomingShowsInCity(cityId, now, now.plus(NOW_SHOWING_WINDOW)).stream()
                .map(MovieSummaryResponse::from)
                .toList();
    }

    public MovieDetailResponse getMovie(Long movieId) {
        return MovieDetailResponse.from(requireMovie(movieId));
    }

    public List<ShowResponse> listShowsForMovieInCity(Long movieId, Long cityId, LocalDate date) {
        requireMovie(movieId);
        requireCity(cityId);

        Instant from = date.atStartOfDay(DISPLAY_ZONE).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(DISPLAY_ZONE).toInstant();

        return showRepository.findByMovieAndCityAndDateRange(movieId, cityId, from, to).stream()
                .map(ShowResponse::from)
                .toList();
    }

    private City requireCity(Long cityId) {
        return cityRepository.findById(cityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "City not found: " + cityId));
    }

    private Movie requireMovie(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found: " + movieId));
    }
}
