package com.snapgallery.gallery;

import com.snapgallery.photo.Photo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, String> {
    List<GalleryPhoto> findByGalleryId(String galleryId);
    
    void deleteByGalleryId(String galleryId);
    void deleteByPhotoId(String photoId);

    @Query("SELECT gp.photo FROM GalleryPhoto gp WHERE gp.gallery.id = :galleryId")
    Page<Photo> findPhotosByGalleryId(@Param("galleryId") String galleryId, Pageable pageable);

    @Query("SELECT gp.photo.id FROM GalleryPhoto gp WHERE gp.gallery.id = :galleryId")
    List<String> findPhotoIdsByGalleryId(@Param("galleryId") String galleryId);

    long countByGalleryId(String galleryId);
}
