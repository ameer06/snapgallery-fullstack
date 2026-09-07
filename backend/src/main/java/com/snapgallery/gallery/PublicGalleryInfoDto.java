package com.snapgallery.gallery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicGalleryInfoDto {
    private String name;
    private String description;
    private String publicSlug;
    private GalleryStatus status;
    private long totalPhotos;
    private LocalDateTime publishedAt;
}
