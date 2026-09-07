package com.snapgallery.event;

import com.snapgallery.common.PageResponse;
import com.snapgallery.exception.ApiException;
import com.snapgallery.photo.PhotoRepository;
import com.snapgallery.user.User;
import com.snapgallery.user.UserRepository;
import com.snapgallery.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;

    @Transactional
    public EventDto createEvent(CreateEventRequest request, String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> ApiException.notFound("Admin user not found", "USER_NOT_FOUND"));

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .coverPhotoUrl(request.getCoverPhotoUrl())
                .createdBy(admin)
                .build();

        Event savedEvent = eventRepository.save(event);

        // Automatically assign creator admin to event
        EventMember eventMember = EventMember.builder()
                .event(savedEvent)
                .user(admin)
                .build();
        eventMemberRepository.save(eventMember);

        return EventDto.fromEntity(savedEvent, 0, 1);
    }

    public PageResponse<EventDto> getEventsForUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Event> eventPage;

        if (user.getRole() == UserRole.ADMIN) {
            eventPage = eventRepository.findAll(pageable);
        } else {
            eventPage = eventRepository.findAssignedEventsForUser(user.getId(), pageable);
        }

        Page<EventDto> dtoPage = eventPage.map(event -> {
            long totalPhotos = photoRepository.countByEventId(event.getId());
            long totalMembers = eventMemberRepository.findByEventId(event.getId()).size();
            return EventDto.fromEntity(event, totalPhotos, totalMembers);
        });

        return PageResponse.from(dtoPage);
    }

    public EventDto getEventById(String eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        if (user.getRole() != UserRole.ADMIN && !eventMemberRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            throw ApiException.forbidden("You are not assigned to this event", "EVENT_ACCESS_DENIED");
        }

        long totalPhotos = photoRepository.countByEventId(event.getId());
        long totalMembers = eventMemberRepository.findByEventId(event.getId()).size();
        return EventDto.fromEntity(event, totalPhotos, totalMembers);
    }

    @Transactional
    public EventDto updateEvent(String eventId, UpdateEventRequest request, String adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        if (request.getCoverPhotoUrl() != null) {
            event.setCoverPhotoUrl(request.getCoverPhotoUrl());
        }

        Event updatedEvent = eventRepository.save(event);
        long totalPhotos = photoRepository.countByEventId(updatedEvent.getId());
        long totalMembers = eventMemberRepository.findByEventId(updatedEvent.getId()).size();
        return EventDto.fromEntity(updatedEvent, totalPhotos, totalMembers);
    }

    @Transactional
    public void deleteEvent(String eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw ApiException.notFound("Event not found", "EVENT_NOT_FOUND");
        }
        eventRepository.deleteById(eventId);
    }

    @Transactional
    public EventMemberDto addMemberToEvent(String eventId, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found", "USER_NOT_FOUND"));

        if (eventMemberRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw ApiException.conflict("User is already assigned to this event", "MEMBER_ALREADY_ASSIGNED");
        }

        EventMember member = EventMember.builder()
                .event(event)
                .user(user)
                .build();

        return EventMemberDto.fromEntity(eventMemberRepository.save(member));
    }

    @Transactional
    public void removeMemberFromEvent(String eventId, String userId) {
        if (!eventMemberRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw ApiException.notFound("User is not assigned to this event", "MEMBER_NOT_ASSIGNED");
        }
        eventMemberRepository.deleteByEventIdAndUserId(eventId, userId);
    }

    public List<EventMemberDto> getEventMembers(String eventId, User currentUser) {
        if (currentUser.getRole() != UserRole.ADMIN && !eventMemberRepository.existsByEventIdAndUserId(eventId, currentUser.getId())) {
            throw ApiException.forbidden("You are not authorized to view members of this event", "EVENT_ACCESS_DENIED");
        }

        return eventMemberRepository.findByEventId(eventId).stream()
                .map(EventMemberDto::fromEntity)
                .collect(Collectors.toList());
    }
}
