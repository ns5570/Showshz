package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.MovieRequest;
import com.showszn.backend.admin.dto.MovieWithShowsRequest;
import com.showszn.backend.admin.dto.ShowRequest;
import com.showszn.backend.catalog.Movie;
import com.showszn.backend.catalog.MovieRepository;
import com.showszn.backend.catalog.Show;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminMovieService {

    private final MovieRepository movieRepository;
    private final AdminShowService adminShowService;

    public AdminMovieService(MovieRepository movieRepository, AdminShowService adminShowService) {
        this.movieRepository = movieRepository;
        this.adminShowService = adminShowService;
    }

    public Page<Movie> listAll(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    public List<Movie> listAllUnpaged() {
        return movieRepository.findAll(Sort.by("title"));
    }

    @CacheEvict(value = "moviesByCity", allEntries = true)
    public Movie create(MovieRequest request) {
        Movie movie = Movie.builder()
                .title(request.title())
                .slug(request.slug())
                .description(request.description())
                .durationMinutes(request.durationMinutes())
                .languages(new LinkedHashSet<>(request.languages()))
                .genres(new LinkedHashSet<>(request.genres()))
                .releaseDate(request.releaseDate())
                .posterUrl(request.posterUrl())
                .censorRating(request.censorRating())
                .trailerUrl(request.trailerUrl())
                .createdAt(Instant.now())
                .build();
        return movieRepository.save(movie);
    }

    @CacheEvict(value = "moviesByCity", allEntries = true)
    public Movie update(Long movieId, MovieRequest request) {
        Movie movie = requireMovie(movieId);
        movie.setTitle(request.title());
        movie.setSlug(request.slug());
        movie.setDescription(request.description());
        movie.setDurationMinutes(request.durationMinutes());
        movie.setLanguages(new LinkedHashSet<>(request.languages()));
        movie.setGenres(new LinkedHashSet<>(request.genres()));
        movie.setReleaseDate(request.releaseDate());
        movie.setPosterUrl(request.posterUrl());
        movie.setCensorRating(request.censorRating());
        movie.setTrailerUrl(request.trailerUrl());
        return movieRepository.save(movie);
    }

    @Transactional
    @CacheEvict(value = "moviesByCity", allEntries = true)
    public MovieWithShows createWithShows(MovieWithShowsRequest request) {
        Movie movie = create(request.movie());

        List<Show> shows = request.screenIds().stream()
                .flatMap(screenId -> request.startTimes().stream()
                        .map(startTime -> adminShowService.create(
                                new ShowRequest(movie.getId(), screenId, startTime, request.basePrice()))))
                .toList();

        return new MovieWithShows(movie, shows);
    }

    public record MovieWithShows(Movie movie, List<Show> shows) {}

    @CacheEvict(value = "moviesByCity", allEntries = true)
    public void delete(Long movieId) {
        requireMovie(movieId);
        movieRepository.deleteById(movieId);
    }

    private Movie requireMovie(Long movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found: " + movieId));
    }
}
