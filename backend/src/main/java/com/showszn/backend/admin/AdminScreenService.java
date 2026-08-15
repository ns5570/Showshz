package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.ScreenRequest;
import com.showszn.backend.catalog.Screen;
import com.showszn.backend.catalog.ScreenRepository;
import com.showszn.backend.catalog.Seat;
import com.showszn.backend.catalog.SeatRepository;
import com.showszn.backend.catalog.SeatType;
import com.showszn.backend.catalog.Venue;
import com.showszn.backend.catalog.VenueRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminScreenService {

    private static final Map<String, SeatType> ROW_TEMPLATE = Map.of(
            "A", SeatType.REGULAR,
            "B", SeatType.REGULAR,
            "C", SeatType.PREMIUM,
            "D", SeatType.PREMIUM,
            "E", SeatType.RECLINER);
    private static final List<String> ROW_ORDER = List.of("A", "B", "C", "D", "E");
    private static final int SEATS_PER_ROW = 8;

    private final ScreenRepository screenRepository;
    private final VenueRepository venueRepository;
    private final SeatRepository seatRepository;

    public AdminScreenService(ScreenRepository screenRepository, VenueRepository venueRepository, SeatRepository seatRepository) {
        this.screenRepository = screenRepository;
        this.venueRepository = venueRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional(readOnly = true)
    public List<Screen> listByVenue(Long venueId) {
        return screenRepository.findByVenueId(venueId);
    }

    @Transactional
    public Screen create(Long venueId, ScreenRequest request) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue not found: " + venueId));

        Screen screen = Screen.builder()
                .venue(venue)
                .name(request.name())
                .createdAt(Instant.now())
                .build();
        screen = screenRepository.save(screen);

        for (String rowLabel : ROW_ORDER) {
            SeatType seatType = ROW_TEMPLATE.get(rowLabel);
            for (int seatNumber = 1; seatNumber <= SEATS_PER_ROW; seatNumber++) {
                Seat seat = Seat.builder()
                        .screen(screen)
                        .rowLabel(rowLabel)
                        .seatNumber(seatNumber)
                        .seatType(seatType)
                        .build();
                seatRepository.save(seat);
            }
        }

        return screen;
    }

    public int seatCount(Long screenId) {
        return seatRepository.findByScreenId(screenId).size();
    }
}
