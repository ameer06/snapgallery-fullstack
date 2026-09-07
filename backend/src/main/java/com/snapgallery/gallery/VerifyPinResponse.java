package com.snapgallery.gallery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPinResponse {
    private String sessionToken;
    private String publicSlug;
    private long expiresMs;
}
