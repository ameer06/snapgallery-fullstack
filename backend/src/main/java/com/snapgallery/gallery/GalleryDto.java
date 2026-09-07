package com.snapgallery.gallery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GalleryDto {
    private String id;
    private String eventId;
    private String eventName;
    private String name;
    private String description;
    private String publicSlug;
    private GalleryStatus status;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    private long totalPhotos;
    private List<String> photoIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GalleryDto fromEntity(Gallery gallery, long totalPhotos, List<String> photoIds) {
        return GalleryDto.builder()
                .id(gallery.getId())
                .eventId(gallery.getEvent().getId())
                .eventName(gallery.getEvent().getName())
                .name(gallery.getName())
                .description(gallery.getDescription())
                .publicSlug(gallery.getPublicSlug())
                .status(gallery.getStatus())
                .publishedAt(gallery.getPublishedAt())
                .expiresAt(gallery.getExpiresAt())
                .totalPhotos(totalPhotos)
                .photoIds(photoIds)
                .createdAt(gallery.getCreatedAt())
                .updatedAt(gallery.getUpdatedAt())
                .build();
    }
}
