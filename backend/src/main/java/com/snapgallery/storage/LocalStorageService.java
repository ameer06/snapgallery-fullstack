package com.snapgallery.storage;

import com.snapgallery.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalStorageService implements StorageService {

    private final Path uploadPath;

    public LocalStorageService(@Value("${app.s3.local-fallback-dir:./uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create local upload directory", ex);
        }
    }

    @Override
    public String store(InputStream inputStream, String key, String contentType, long contentLength) {
        try {
            Path targetLocation = this.uploadPath.resolve(key);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return getStorageUrl(key);
        } catch (Exception ex) {
            throw ApiException.badRequest("Failed to store file locally: " + ex.getMessage(), "STORAGE_ERROR");
        }
    }

    @Override
    public String getStorageUrl(String key) {
        return "/uploads/" + key.replace("\\", "/");
    }

    @Override
    public void delete(String key) {
        try {
            Path targetLocation = this.uploadPath.resolve(key);
            Files.deleteIfExists(targetLocation);
        } catch (Exception ignored) {
        }
    }
}
