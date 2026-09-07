package com.snapgallery.photo;

import com.snapgallery.common.ApiResponse;
import com.snapgallery.common.PageResponse;
import com.snapgallery.security.UserPrincipal;
import com.snapgallery.user.User;
import com.snapgallery.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;
    private final UserRepository userRepository;

    @PostMapping("/events/{eventId}/photos")
    public ResponseEntity<ApiResponse<List<PhotoDto>>> uploadPhotos(
            @PathVariable String eventId,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<PhotoDto> photos = photoService.uploadMultiplePhotos(eventId, files, principal.getId());
        return new ResponseEntity<>(ApiResponse.success(photos, "Photos uploaded successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/events/{eventId}/photos")
    public ResponseEntity<ApiResponse<PageResponse<PhotoDto>>> getEventPhotos(
            @PathVariable String eventId,
            @RequestParam(required = false) String uploaderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        PageResponse<PhotoDto> photos = photoService.getEventPhotos(eventId, uploaderId, user, page, size);
        return ResponseEntity.ok(ApiResponse.success(photos));
    }

    @GetMapping("/member/uploads")
    public ResponseEntity<ApiResponse<PageResponse<PhotoDto>>> getOwnUploads(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        PageResponse<PhotoDto> photos = photoService.getOwnUploadedPhotos(principal.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(photos));
    }

    @DeleteMapping("/photos/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        photoService.deletePhoto(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "Photo deleted successfully"));
    }
}
