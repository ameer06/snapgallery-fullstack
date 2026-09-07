package com.snapgallery.event;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddEventMemberRequest {

    @NotBlank(message = "User ID is required")
    private String userId;
}
