package com.showszn.backend.booking;

import com.showszn.backend.booking.dto.ShowSeatMapResponse;
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
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SeatMapService {

    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final SeatRepository seatRepository;
    private final SeatLockService seatLockService;

    public SeatMapService(
            ShowRepository showRepository,
            ShowSeatRepository showSeatRepository,
            SeatRepository seatRepository,
            SeatLockService seatLockService) {
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.seatRepository = seatRepository;
        this.seatLockService = seatLockService;
    }

    @Transactional
    public ShowSeatMapResponse getSeatMap(Long showId) {
        Show show = showRepository.findByIdWithDetails(showId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Show not found: " + showId));

        List<ShowSeat> showSeats = showSeatRepository.findByShowIdWithSeat(showId);
        if (showSeats.isEmpty()) {
            showSeats = generateSeatsForShow(show);
        }

        List<ShowSeatMapResponse.SeatEntry> entries = showSeats.stream()
                .map(this::toEntry)
                .toList();

        return new ShowSeatMapResponse(
                show.getId(),
                show.getMovie().getTitle(),
                show.getScreen().getVenue().getName(),
                show.getScreen().getName(),
                show.getStartTime(),
                entries);
    }

    /**
     * Showtime seat inventory isn't pre-generated for the full 2-year schedule (that's tens
     * of millions of rows most of which would never be viewed) -- it's created here, the
     * first time a show's seat map is actually requested.
     */
    private List<ShowSeat> generateSeatsForShow(Show show) {
        List<Seat> seats = seatRepository.findByScreenId(show.getScreen().getId());
        List<ShowSeat> newShowSeats = seats.stream()
                .map(seat -> ShowSeat.builder()
                        .show(show)
                        .seat(seat)
                        .price(priceFor(show.getBasePrice(), seat.getSeatType()))
                        .status(ShowSeatStatus.AVAILABLE)
                        .build())
                .toList();
        try {
            showSeatRepository.saveAll(newShowSeats);
            showSeatRepository.flush();
        } catch (DataIntegrityViolationException e) {
            // Another request generated this show's seats concurrently; fall through and re-read.
        }
        return showSeatRepository.findByShowIdWithSeat(show.getId());
    }

    private BigDecimal priceFor(BigDecimal basePrice, SeatType seatType) {
        BigDecimal multiplier =
                switch (seatType) {
                    case REGULAR -> BigDecimal.ONE;
                    case PREMIUM -> new BigDecimal("1.5");
                    case RECLINER -> new BigDecimal("2.0");
                };
        return basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }

    private ShowSeatMapResponse.SeatEntry toEntry(ShowSeat showSeat) {
        String status;
        if (showSeat.getStatus() == ShowSeatStatus.BOOKED) {
            status = "BOOKED";
        } else if (seatLockService.isLocked("movie", showSeat.getId())) {
            status = "LOCKED";
        } else {
            status = "AVAILABLE";
        }

        return new ShowSeatMapResponse.SeatEntry(
                showSeat.getId(),
                showSeat.getSeat().getRowLabel(),
                showSeat.getSeat().getSeatNumber(),
                showSeat.getSeat().getSeatType().name(),
                showSeat.getPrice(),
                status);
    }
}
