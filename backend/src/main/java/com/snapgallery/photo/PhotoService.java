package com.snapgallery.photo;

import com.snapgallery.common.PageResponse;
import com.snapgallery.event.Event;
import com.snapgallery.event.EventMemberRepository;
import com.snapgallery.event.EventRepository;
import com.snapgallery.exception.ApiException;
import com.snapgallery.gallery.GalleryPhotoRepository;
import com.snapgallery.storage.LocalStorageService;
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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final UserRepository userRepository;
    private final LocalStorageService storageService;

    private final GalleryPhotoRepository galleryPhotoRepository;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    @Transactional
    public PhotoDto uploadPhoto(String eventId, MultipartFile file, String userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found", "USER_NOT_FOUND"));

        if (user.getRole() != UserRole.ADMIN && !eventMemberRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw ApiException.forbidden("You are not assigned to this event", "EVENT_ACCESS_DENIED");
        }

        validateFile(file);

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = getFileExtension(originalFilename);
        String storageKey = "events/" + eventId + "/photos/" + UUID.randomUUID() + "." + extension;

        try {
            String storageUrl = storageService.store(file.getInputStream(), storageKey, file.getContentType(), file.getSize());

            Photo photo = Photo.builder()
                    .event(event)
                    .uploadedBy(user)
                    .originalFilename(originalFilename)
                    .storageKey(storageKey)
                    .storageUrl(storageUrl)
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .build();

            return PhotoDto.fromEntity(photoRepository.save(photo));
        } catch (IOException e) {
            throw ApiException.badRequest("Failed to read uploaded file", "FILE_READ_ERROR");
        }
    }

    @Transactional
    public List<PhotoDto> uploadMultiplePhotos(String eventId, List<MultipartFile> files, String userId) {
        List<PhotoDto> uploaded = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                uploaded.add(uploadPhoto(eventId, file, userId));
            }
        }
        return uploaded;
    }

    public PageResponse<PhotoDto> getEventPhotos(String eventId, String uploaderId, User user, int page, int size) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        if (user.getRole() != UserRole.ADMIN && !eventMemberRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            throw ApiException.forbidden("You are not assigned to this event", "EVENT_ACCESS_DENIED");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Photo> photoPage = photoRepository.findEventPhotosFiltered(eventId, uploaderId, pageable);

        return PageResponse.from(photoPage.map(PhotoDto::fromEntity));
    }

    public PageResponse<PhotoDto> getOwnUploadedPhotos(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Photo> photoPage = photoRepository.findByUploadedById(userId, pageable);
        return PageResponse.from(photoPage.map(PhotoDto::fromEntity));
    }

    @Transactional
    public void deletePhoto(String photoId, User user) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> ApiException.notFound("Photo not found", "PHOTO_NOT_FOUND"));

        if (user.getRole() != UserRole.ADMIN && !photo.getUploadedBy().getId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have permission to delete this photo", "DELETE_FORBIDDEN");
        }

        galleryPhotoRepository.deleteByPhotoId(photoId);
        storageService.delete(photo.getStorageKey());
        photoRepository.delete(photo);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw ApiException.badRequest("Cannot upload empty file", "EMPTY_FILE");
        }

        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = getFileExtension(filename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw ApiException.badRequest("Invalid file extension. Allowed: JPG, JPEG, PNG, WEBP", "INVALID_FILE_EXTENSION");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw ApiException.badRequest("Invalid file type. Allowed: JPG, PNG, WEBP", "INVALID_MIME_TYPE");
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }
}
