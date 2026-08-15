package com.showszn.backend.event;

import com.showszn.backend.booking.SeatLockService;
import com.showszn.backend.catalog.ShowSeatStatus;
import com.showszn.backend.event.dto.EventShowSeatMapResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventSeatMapService {

    private static final String NAMESPACE = "event";

    private final EventShowRepository eventShowRepository;
    private final EventShowSeatRepository eventShowSeatRepository;
    private final SeatLockService seatLockService;

    public EventSeatMapService(
            EventShowRepository eventShowRepository,
            EventShowSeatRepository eventShowSeatRepository,
            SeatLockService seatLockService) {
        this.eventShowRepository = eventShowRepository;
        this.eventShowSeatRepository = eventShowSeatRepository;
        this.seatLockService = seatLockService;
    }

    @Transactional(readOnly = true)
    public EventShowSeatMapResponse getSeatMap(Long eventShowId) {
        EventShow eventShow = eventShowRepository.findByIdWithDetails(eventShowId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event show not found: " + eventShowId));

        List<EventShowSeat> seats = eventShowSeatRepository.findByEventShowIdWithSeat(eventShowId);

        List<EventShowSeatMapResponse.SeatEntry> entries = seats.stream().map(this::toEntry).toList();

        return new EventShowSeatMapResponse(
                eventShow.getId(),
                eventShow.getEvent().getTitle(),
                eventShow.getScreen().getVenue().getName(),
                eventShow.getScreen().getName(),
                eventShow.getStartTime(),
                entries);
    }

    private EventShowSeatMapResponse.SeatEntry toEntry(EventShowSeat seat) {
        String status;
        if (seat.getStatus() == ShowSeatStatus.BOOKED) {
            status = "BOOKED";
        } else if (seatLockService.isLocked(NAMESPACE, seat.getId())) {
            status = "LOCKED";
        } else {
            status = "AVAILABLE";
        }

        return new EventShowSeatMapResponse.SeatEntry(
                seat.getId(),
                seat.getSeat().getRowLabel(),
                seat.getSeat().getSeatNumber(),
                seat.getSeat().getSeatType().name(),
                seat.getPrice(),
                status);
    }
}
