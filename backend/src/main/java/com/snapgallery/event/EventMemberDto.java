package com.snapgallery.event;

import com.snapgallery.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventMemberDto {
    private String id;
    private String eventId;
    private UserDto user;
    private LocalDateTime assignedAt;

    public static EventMemberDto fromEntity(EventMember member) {
        return EventMemberDto.builder()
                .id(member.getId())
                .eventId(member.getEvent().getId())
                .user(UserDto.fromEntity(member.getUser()))
                .assignedAt(member.getAssignedAt())
                .build();
    }
}
