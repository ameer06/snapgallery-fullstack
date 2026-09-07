package com.snapgallery.storage;

import java.io.InputStream;

public interface StorageService {
    String store(InputStream inputStream, String key, String contentType, long contentLength);
    String getStorageUrl(String key);
    void delete(String key);
}
