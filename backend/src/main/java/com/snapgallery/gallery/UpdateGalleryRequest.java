package com.snapgallery.gallery;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateGalleryRequest {

    @NotBlank(message = "Gallery name is required")
    private String name;

    private String description;

    @Pattern(regexp = "^(\\d{6})?$", message = "PIN must be exactly 6 digits if provided")
    private String pin;

    private List<String> photoIds;

    private LocalDateTime expiresAt;
}
