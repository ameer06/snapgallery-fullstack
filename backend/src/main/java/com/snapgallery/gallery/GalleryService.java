package com.snapgallery.gallery;

import com.snapgallery.common.PageResponse;
import com.snapgallery.event.Event;
import com.snapgallery.event.EventRepository;
import com.snapgallery.exception.ApiException;
import com.snapgallery.photo.Photo;
import com.snapgallery.photo.PhotoDto;
import com.snapgallery.photo.PhotoRepository;
import com.snapgallery.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final GalleryPhotoRepository galleryPhotoRepository;
    private final EventRepository eventRepository;
    private final PhotoRepository photoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    private static final String SLUG_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public GalleryDto createGallery(String eventId, CreateGalleryRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> ApiException.notFound("Event not found", "EVENT_NOT_FOUND"));

        String publicSlug = generateUniqueSlug();
        String pinHash = passwordEncoder.encode(request.getPin());

        Gallery gallery = Gallery.builder()
                .event(event)
                .name(request.getName())
                .description(request.getDescription())
                .publicSlug(publicSlug)
                .pinHash(pinHash)
                .status(GalleryStatus.DRAFT)
                .expiresAt(request.getExpiresAt())
                .build();

        Gallery savedGallery = galleryRepository.save(gallery);

        List<Photo> photos = photoRepository.findByIdIn(request.getPhotoIds());
        for (Photo photo : photos) {
            GalleryPhoto galleryPhoto = GalleryPhoto.builder()
                    .gallery(savedGallery)
                    .photo(photo)
                    .build();
            galleryPhotoRepository.save(galleryPhoto);
        }

        List<String> photoIds = photos.stream().map(Photo::getId).collect(Collectors.toList());
        return GalleryDto.fromEntity(savedGallery, photoIds.size(), photoIds);
    }

    @Transactional
    public GalleryDto updateGallery(String galleryId, UpdateGalleryRequest request) {
        Gallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> ApiException.notFound("Gallery not found", "GALLERY_NOT_FOUND"));

        gallery.setName(request.getName());
        gallery.setDescription(request.getDescription());
        if (request.getPin() != null && !request.getPin().isBlank()) {
            gallery.setPinHash(passwordEncoder.encode(request.getPin()));
        }
        if (request.getExpiresAt() != null) {
            gallery.setExpiresAt(request.getExpiresAt());
        }

        if (request.getPhotoIds() != null) {
            galleryPhotoRepository.deleteByGalleryId(galleryId);
            List<Photo> photos = photoRepository.findByIdIn(request.getPhotoIds());
            for (Photo photo : photos) {
                GalleryPhoto galleryPhoto = GalleryPhoto.builder()
                        .gallery(gallery)
                        .photo(photo)
                        .build();
                galleryPhotoRepository.save(galleryPhoto);
            }
        }

        Gallery updatedGallery = galleryRepository.save(gallery);
        List<String> photoIds = galleryPhotoRepository.findPhotoIdsByGalleryId(galleryId);
        return GalleryDto.fromEntity(updatedGallery, photoIds.size(), photoIds);
    }

    @Transactional
    public GalleryDto publishGallery(String galleryId) {
        Gallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> ApiException.notFound("Gallery not found", "GALLERY_NOT_FOUND"));

        gallery.setStatus(GalleryStatus.PUBLISHED);
        gallery.setPublishedAt(LocalDateTime.now());
        Gallery saved = galleryRepository.save(gallery);

        List<String> photoIds = galleryPhotoRepository.findPhotoIdsByGalleryId(galleryId);
        return GalleryDto.fromEntity(saved, photoIds.size(), photoIds);
    }

    @Transactional
    public GalleryDto unpublishGallery(String galleryId) {
        Gallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> ApiException.notFound("Gallery not found", "GALLERY_NOT_FOUND"));

        gallery.setStatus(GalleryStatus.UNPUBLISHED);
        Gallery saved = galleryRepository.save(gallery);

        List<String> photoIds = galleryPhotoRepository.findPhotoIdsByGalleryId(galleryId);
        return GalleryDto.fromEntity(saved, photoIds.size(), photoIds);
    }

    public List<GalleryDto> getGalleriesForEvent(String eventId) {
        return galleryRepository.findAllByEventId(eventId).stream()
                .map(g -> {
                    List<String> photoIds = galleryPhotoRepository.findPhotoIdsByGalleryId(g.getId());
                    return GalleryDto.fromEntity(g, photoIds.size(), photoIds);
                })
                .collect(Collectors.toList());
    }

    public PublicGalleryInfoDto getPublicGalleryInfo(String slug) {
        Gallery gallery = galleryRepository.findByPublicSlug(slug)
                .orElseThrow(() -> ApiException.notFound("Gallery not found", "GALLERY_NOT_FOUND"));

        if (gallery.getStatus() != GalleryStatus.PUBLISHED) {
            throw ApiException.forbidden("Gallery is currently unavailable or unpublished", "GALLERY_UNAVAILABLE");
        }

        if (gallery.getExpiresAt() != null && LocalDateTime.now().isAfter(gallery.getExpiresAt())) {
            gallery.setStatus(GalleryStatus.EXPIRED);
            galleryRepository.save(gallery);
            throw ApiException.forbidden("Gallery has expired", "GALLERY_EXPIRED");
        }

        long totalPhotos = galleryPhotoRepository.countByGalleryId(gallery.getId());

        return PublicGalleryInfoDto.builder()
                .name(gallery.getName())
                .description(gallery.getDescription())
                .publicSlug(gallery.getPublicSlug())
                .status(gallery.getStatus())
                .totalPhotos(totalPhotos)
                .publishedAt(gallery.getPublishedAt())
                .build();
    }

    public VerifyPinResponse verifyPin(String slug, String pin) {
        Gallery gallery = galleryRepository.findByPublicSlug(slug)
                .orElseThrow(() -> ApiException.unauthorized("Invalid gallery PIN or access code", "INVALID_PIN"));

        if (gallery.getStatus() != GalleryStatus.PUBLISHED) {
            throw ApiException.forbidden("Gallery is not published or unavailable", "GALLERY_UNAVAILABLE");
        }

        if (gallery.getExpiresAt() != null && LocalDateTime.now().isAfter(gallery.getExpiresAt())) {
            gallery.setStatus(GalleryStatus.EXPIRED);
            galleryRepository.save(gallery);
            throw ApiException.forbidden("Gallery has expired", "GALLERY_EXPIRED");
        }

        if (!passwordEncoder.matches(pin, gallery.getPinHash())) {
            throw ApiException.unauthorized("Invalid gallery PIN or access code", "INVALID_PIN");
        }

        String sessionToken = tokenProvider.generateGallerySessionToken(gallery.getId(), slug);

        return VerifyPinResponse.builder()
                .sessionToken(sessionToken)
                .publicSlug(slug)
                .expiresMs(7200000L) // 2 hours
                .build();
    }

    public PageResponse<PhotoDto> getCustomerGalleryPhotos(String slug, String sessionToken, int page, int size) {
        if (sessionToken == null || !tokenProvider.validateToken(sessionToken)) {
            throw ApiException.unauthorized("Invalid or expired gallery session token", "INVALID_SESSION");
        }

        Claims claims = tokenProvider.getClaimsFromToken(sessionToken);
        String tokenType = claims.get("type", String.class);
        String tokenSlug = claims.get("slug", String.class);

        if (!"CUSTOMER_GALLERY".equals(tokenType) || !slug.equals(tokenSlug)) {
            throw ApiException.unauthorized("Unauthorized gallery session", "UNAUTHORIZED_SESSION");
        }

        Gallery gallery = galleryRepository.findByPublicSlug(slug)
                .orElseThrow(() -> ApiException.notFound("Gallery not found", "GALLERY_NOT_FOUND"));

        if (gallery.getStatus() != GalleryStatus.PUBLISHED) {
            throw ApiException.forbidden("Gallery is not published", "GALLERY_UNAVAILABLE");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Photo> photoPage = galleryPhotoRepository.findPhotosByGalleryId(gallery.getId(), pageable);

        return PageResponse.from(photoPage.map(PhotoDto::fromEntity));
    }

    private String generateUniqueSlug() {
        String slug;
        do {
            StringBuilder sb = new StringBuilder(8);
            for (int i = 0; i < 8; i++) {
                sb.append(SLUG_CHARACTERS.charAt(RANDOM.nextInt(SLUG_CHARACTERS.length())));
            }
            slug = sb.toString();
        } while (galleryRepository.existsByPublicSlug(slug));
        return slug;
    }
}
