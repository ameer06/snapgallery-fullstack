package com.snapgallery.gallery;

import com.snapgallery.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    @PostMapping("/events/{eventId}/gallery")
    public ResponseEntity<ApiResponse<GalleryDto>> createGallery(
            @PathVariable String eventId,
            @Valid @RequestBody CreateGalleryRequest request) {
        GalleryDto gallery = galleryService.createGallery(eventId, request);
        return new ResponseEntity<>(ApiResponse.success(gallery, "Gallery created successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/events/{eventId}/gallery")
    public ResponseEntity<ApiResponse<List<GalleryDto>>> getGalleriesForEvent(@PathVariable String eventId) {
        List<GalleryDto> galleries = galleryService.getGalleriesForEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success(galleries));
    }

    @PutMapping("/galleries/{id}")
    public ResponseEntity<ApiResponse<GalleryDto>> updateGallery(
            @PathVariable String id,
            @Valid @RequestBody UpdateGalleryRequest request) {
        GalleryDto gallery = galleryService.updateGallery(id, request);
        return ResponseEntity.ok(ApiResponse.success(gallery, "Gallery updated successfully"));
    }

    @PostMapping("/galleries/{id}/publish")
    public ResponseEntity<ApiResponse<GalleryDto>> publishGallery(@PathVariable String id) {
        GalleryDto gallery = galleryService.publishGallery(id);
        return ResponseEntity.ok(ApiResponse.success(gallery, "Gallery published successfully"));
    }

    @PostMapping("/galleries/{id}/unpublish")
    public ResponseEntity<ApiResponse<GalleryDto>> unpublishGallery(@PathVariable String id) {
        GalleryDto gallery = galleryService.unpublishGallery(id);
        return ResponseEntity.ok(ApiResponse.success(gallery, "Gallery unpublished successfully"));
    }
}
