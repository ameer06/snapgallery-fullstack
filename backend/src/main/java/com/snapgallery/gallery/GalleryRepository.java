package com.snapgallery.gallery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, String> {
    Optional<Gallery> findByPublicSlug(String publicSlug);
    Optional<Gallery> findByEventId(String eventId);
    List<Gallery> findAllByEventId(String eventId);
    boolean existsByPublicSlug(String publicSlug);
}
