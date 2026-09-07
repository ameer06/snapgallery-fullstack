package com.snapgallery.gallery;

import com.snapgallery.common.ApiResponse;
import com.snapgallery.common.PageResponse;
import com.snapgallery.photo.PhotoDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/gallery")
@RequiredArgsConstructor
public class PublicGalleryController {

    private final GalleryService galleryService;

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicGalleryInfoDto>> getPublicGalleryInfo(@PathVariable String slug) {
        PublicGalleryInfoDto info = galleryService.getPublicGalleryInfo(slug);
        return ResponseEntity.ok(ApiResponse.success(info));
    }

    @PostMapping("/{slug}/verify")
    public ResponseEntity<ApiResponse<VerifyPinResponse>> verifyPin(
            @PathVariable String slug,
            @Valid @RequestBody VerifyPinRequest request) {
        VerifyPinResponse response = galleryService.verifyPin(slug, request.getPin());
        return ResponseEntity.ok(ApiResponse.success(response, "PIN verified successfully"));
    }

    @GetMapping("/{slug}/photos")
    public ResponseEntity<ApiResponse<PageResponse<PhotoDto>>> getPublicPhotos(
            @PathVariable String slug,
            @RequestHeader(value = "Gallery-Session-Token", required = false) String sessionToken,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        PageResponse<PhotoDto> photos = galleryService.getCustomerGalleryPhotos(slug, sessionToken, page, size);
        return ResponseEntity.ok(ApiResponse.success(photos));
    }
}
