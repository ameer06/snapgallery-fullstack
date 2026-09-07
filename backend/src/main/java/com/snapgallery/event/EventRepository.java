package com.snapgallery.event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    @Query("SELECT e FROM Event e JOIN EventMember em ON em.event = e WHERE em.user.id = :userId")
    Page<Event> findAssignedEventsForUser(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT COUNT(e) > 0 FROM Event e JOIN EventMember em ON em.event = e WHERE e.id = :eventId AND em.user.id = :userId")
    boolean isUserAssignedToEvent(@Param("eventId") String eventId, @Param("userId") String userId);
}
