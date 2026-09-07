package com.snapgallery.photo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, String> {
    Page<Photo> findByEventId(String eventId, Pageable pageable);
    
    Page<Photo> findByEventIdAndUploadedById(String eventId, String uploadedById, Pageable pageable);

    Page<Photo> findByUploadedById(String uploadedById, Pageable pageable);

    @Query("SELECT p FROM Photo p WHERE p.event.id = :eventId AND (:uploaderId IS NULL OR p.uploadedBy.id = :uploaderId)")
    Page<Photo> findEventPhotosFiltered(@Param("eventId") String eventId, @Param("uploaderId") String uploaderId, Pageable pageable);

    long countByEventId(String eventId);

    List<Photo> findByIdIn(List<String> ids);
}
