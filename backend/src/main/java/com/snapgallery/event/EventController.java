package com.snapgallery.event;

import com.snapgallery.common.ApiResponse;
import com.snapgallery.common.PageResponse;
import com.snapgallery.security.UserPrincipal;
import com.snapgallery.user.User;
import com.snapgallery.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventDto>> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventDto event = eventService.createEvent(request, principal.getId());
        return new ResponseEntity<>(ApiResponse.success(event, "Event created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EventDto>>> getEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        PageResponse<EventDto> response = eventService.getEventsForUser(user, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDto>> getEventById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        EventDto event = eventService.getEventById(id, user);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventDto>> updateEvent(
            @PathVariable String id,
            @Valid @RequestBody UpdateEventRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        EventDto event = eventService.updateEvent(id, request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(event, "Event updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Event deleted successfully"));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventMemberDto>> addMember(
            @PathVariable String id,
            @Valid @RequestBody AddEventMemberRequest request) {
        EventMemberDto member = eventService.addMemberToEvent(id, request.getUserId());
        return new ResponseEntity<>(ApiResponse.success(member, "Team member added to event"), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable String id,
            @PathVariable String userId) {
        eventService.removeMemberFromEvent(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Team member removed from event"));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<EventMemberDto>>> getMembers(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User currentUser = userRepository.findById(principal.getId()).orElseThrow();
        List<EventMemberDto> members = eventService.getEventMembers(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(members));
    }
}
