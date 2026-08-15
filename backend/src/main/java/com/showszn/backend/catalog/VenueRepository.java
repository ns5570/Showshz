package com.showszn.backend.catalog;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByCityId(Long cityId);

    @Query(value = "select v from Venue v join fetch v.city", countQuery = "select count(v) from Venue v")
    Page<Venue> findAllWithCity(Pageable pageable);

    @Query("""
            select v from Venue v
            join fetch v.city
            where lower(v.name) like lower(concat('%', :query, '%'))
            order by v.name
            """)
    List<Venue> searchByName(@Param("query") String query);
}
