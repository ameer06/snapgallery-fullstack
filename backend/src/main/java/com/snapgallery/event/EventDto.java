package com.snapgallery.event;

import com.snapgallery.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private String id;
    private String name;
    private String description;
    private LocalDate eventDate;
    private String location;
    private String coverPhotoUrl;
    private UserDto createdBy;
    private long totalPhotos;
    private long totalMembers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventDto fromEntity(Event event, long totalPhotos, long totalMembers) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .coverPhotoUrl(event.getCoverPhotoUrl())
                .createdBy(UserDto.fromEntity(event.getCreatedBy()))
                .totalPhotos(totalPhotos)
                .totalMembers(totalMembers)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
