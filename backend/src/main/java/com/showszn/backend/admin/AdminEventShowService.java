package com.showszn.backend.admin;

import com.showszn.backend.admin.dto.EventShowRequest;
import com.showszn.backend.catalog.Screen;
import com.showszn.backend.catalog.ScreenRepository;
import com.showszn.backend.catalog.Seat;
import com.showszn.backend.catalog.SeatRepository;
import com.showszn.backend.catalog.SeatType;
import com.showszn.backend.catalog.ShowSeatStatus;
import com.showszn.backend.event.Event;
import com.showszn.backend.event.EventRepository;
import com.showszn.backend.event.EventShow;
import com.showszn.backend.event.EventShowRepository;
import com.showszn.backend.event.EventShowSeat;
import com.showszn.backend.event.EventShowSeatRepository;
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
public class AdminEventShowService {

    private static final Map<SeatType, BigDecimal> PRICE_MULTIPLIER = Map.of(
            SeatType.REGULAR, new BigDecimal("1.0"),
            SeatType.PREMIUM, new BigDecimal("1.5"),
            SeatType.RECLINER, new BigDecimal("2.0"));
    private static final int DEFAULT_DURATION_MINUTES = 120;
    private static final int BUFFER_MINUTES = 15;

    private final EventShowRepository eventShowRepository;
    private final EventRepository eventRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final EventShowSeatRepository eventShowSeatRepository;

    public AdminEventShowService(
            EventShowRepository eventShowRepository,
            EventRepository eventRepository,
            ScreenRepository screenRepository,
            SeatRepository seatRepository,
            EventShowSeatRepository eventShowSeatRepository) {
        this.eventShowRepository = eventShowRepository;
        this.eventRepository = eventRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.eventShowSeatRepository = eventShowSeatRepository;
    }

    @Transactional(readOnly = true)
    public Page<EventShow> listAll(Pageable pageable) {
        return eventShowRepository.findAllWithDetails(pageable);
    }

    @Transactional
    @CacheEvict(value = "eventsByCity", allEntries = true)
    public EventShow create(EventShowRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found: " + request.eventId()));
        Screen screen = screenRepository.findByIdWithVenue(request.screenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Screen not found: " + request.screenId()));

        int durationMinutes = event.getDurationMinutes() != null ? event.getDurationMinutes() : DEFAULT_DURATION_MINUTES;
        Instant endTime = request.startTime().plus(durationMinutes + BUFFER_MINUTES, ChronoUnit.MINUTES);

        EventShow eventShow = EventShow.builder()
                .event(event)
                .screen(screen)
                .startTime(request.startTime())
                .endTime(endTime)
                .basePrice(request.basePrice())
                .createdAt(Instant.now())
                .build();
        eventShow = eventShowRepository.save(eventShow);

        List<Seat> seats = seatRepository.findByScreenId(screen.getId());
        for (Seat seat : seats) {
            BigDecimal price = request.basePrice()
                    .multiply(PRICE_MULTIPLIER.get(seat.getSeatType()))
                    .setScale(2, RoundingMode.HALF_UP);
            EventShowSeat eventShowSeat = EventShowSeat.builder()
                    .eventShow(eventShow)
                    .seat(seat)
                    .price(price)
                    .status(ShowSeatStatus.AVAILABLE)
                    .build();
            eventShowSeatRepository.save(eventShowSeat);
        }

        return eventShow;
    }
}
