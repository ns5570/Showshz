package com.showszn.backend.catalog;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByVenueId(Long venueId);

    @Query("select s from Screen s join fetch s.venue where s.id = :id")
    Optional<Screen> findByIdWithVenue(@Param("id") Long id);
}
