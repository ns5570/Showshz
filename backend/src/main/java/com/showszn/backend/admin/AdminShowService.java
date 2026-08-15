package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.ShowRequest;
import com.showszn.backend.catalog.Movie;
import com.showszn.backend.catalog.MovieRepository;
import com.showszn.backend.catalog.Screen;
import com.showszn.backend.catalog.ScreenRepository;
import com.showszn.backend.catalog.Seat;
import com.showszn.backend.catalog.SeatRepository;
import com.showszn.backend.catalog.SeatType;
import com.showszn.backend.catalog.Show;
import com.showszn.backend.catalog.ShowRepository;
import com.showszn.backend.catalog.ShowSeat;
import com.showszn.backend.catalog.ShowSeatRepository;
import com.showszn.backend.catalog.ShowSeatStatus;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminShowService {

    private static final Map<SeatType, BigDecimal> PRICE_MULTIPLIER = Map.of(
            SeatType.REGULAR, new BigDecimal("1.0"),
            SeatType.PREMIUM, new BigDecimal("1.5"),
            SeatType.RECLINER, new BigDecimal("2.0"));
    private static final int BUFFER_MINUTES = 15;

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;

    public AdminShowService(
            ShowRepository showRepository,
            MovieRepository movieRepository,
            ScreenRepository screenRepository,
            SeatRepository seatRepository,
            ShowSeatRepository showSeatRepository) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
    }

    @Transactional(readOnly = true)
    public Page<Show> listAll(Pageable pageable) {
        return showRepository.findAllWithDetails(pageable);
    }

    @Transactional
    @CacheEvict(value = "moviesByCity", allEntries = true)
    public Show create(ShowRequest request) {
        Movie movie = movieRepository.findById(request.movieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found: " + request.movieId()));
        Screen screen = screenRepository.findByIdWithVenue(request.screenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Screen not found: " + request.screenId()));

        Instant endTime = request.startTime().plus(movie.getDurationMinutes() + BUFFER_MINUTES, ChronoUnit.MINUTES);

        Show show = Show.builder()
                .movie(movie)
                .screen(screen)
                .startTime(request.startTime())
                .endTime(endTime)
                .basePrice(request.basePrice())
                .createdAt(Instant.now())
                .build();
        show = showRepository.save(show);

        List<Seat> seats = seatRepository.findByScreenId(screen.getId());
        for (Seat seat : seats) {
            BigDecimal price = request.basePrice()
                    .multiply(PRICE_MULTIPLIER.get(seat.getSeatType()))
                    .setScale(2, RoundingMode.HALF_UP);
            ShowSeat showSeat = ShowSeat.builder()
                    .show(show)
                    .seat(seat)
                    .price(price)
                    .status(ShowSeatStatus.AVAILABLE)
                    .build();
            showSeatRepository.save(showSeat);
        }

        return show;
    }
}
