package com.showszn.backend.booking;

import com.showszn.backend.booking.dto.ShowSeatMapResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/shows")
public class SeatMapController {

    private final SeatMapService seatMapService;

    public SeatMapController(SeatMapService seatMapService) {
        this.seatMapService = seatMapService;
    }

    @GetMapping("/{showId}/seat-map")
    public ShowSeatMapResponse getSeatMap(@PathVariable Long showId) {
        return seatMapService.getSeatMap(showId);
    }
}
