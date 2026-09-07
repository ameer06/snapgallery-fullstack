package com.snapgallery.event;

import com.snapgallery.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, String> {
    List<EventMember> findByEventId(String eventId);
    Optional<EventMember> findByEventIdAndUserId(String eventId, String userId);
    boolean existsByEventIdAndUserId(String eventId, String userId);
    void deleteByEventIdAndUserId(String eventId, String userId);
}
