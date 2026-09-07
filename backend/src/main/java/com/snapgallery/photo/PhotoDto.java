package com.snapgallery.photo;

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
public class PhotoDto {
    private String id;
    private String eventId;
    private UserDto uploadedBy;
    private String originalFilename;
    private String storageKey;
    private String storageUrl;
    private Long fileSize;
    private String contentType;
    private LocalDateTime createdAt;

    public static PhotoDto fromEntity(Photo photo) {
        return PhotoDto.builder()
                .id(photo.getId())
                .eventId(photo.getEvent().getId())
                .uploadedBy(UserDto.fromEntity(photo.getUploadedBy()))
                .originalFilename(photo.getOriginalFilename())
                .storageKey(photo.getStorageKey())
                .storageUrl(photo.getStorageUrl())
                .fileSize(photo.getFileSize())
                .contentType(photo.getContentType())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
