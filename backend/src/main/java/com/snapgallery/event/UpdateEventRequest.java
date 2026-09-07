package com.snapgallery.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateEventRequest {

    @NotBlank(message = "Event name is required")
    @Size(min = 2, max = 150, message = "Event name must be between 2 and 150 characters")
    private String name;

    private String description;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    private String location;

    private String coverPhotoUrl;
}
