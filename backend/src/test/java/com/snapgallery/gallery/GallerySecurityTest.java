package com.snapgallery.gallery;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.snapgallery.auth.AuthResponse;
import com.snapgallery.auth.LoginRequest;
import com.snapgallery.event.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class GallerySecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    private String adminToken;
    private String eventId;
    private String gallerySlug;

    @BeforeEach
    public void setup() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@snapgallery.demo");
        loginRequest.setPassword("admin123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String loginContent = loginResult.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(
                objectMapper.readTree(loginContent).get("data").toString(),
                AuthResponse.class
        );
        this.adminToken = authResponse.getToken();
        this.eventId = eventRepository.findAll().get(0).getId();

        // Create a gallery with PIN 482917
        CreateGalleryRequest galleryRequest = new CreateGalleryRequest();
        galleryRequest.setName("Test Wedding Gallery");
        galleryRequest.setPin("482917");
        galleryRequest.setPhotoIds(List.of());

        MvcResult galleryResult = mockMvc.perform(post("/api/events/" + eventId + "/gallery")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(galleryRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String galleryContent = galleryResult.getResponse().getContentAsString();
        String galleryId = objectMapper.readTree(galleryContent).get("data").get("id").asText();
        this.gallerySlug = objectMapper.readTree(galleryContent).get("data").get("publicSlug").asText();

        // Publish gallery
        mockMvc.perform(post("/api/galleries/" + galleryId + "/publish")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testIncorrectPinDenied() throws Exception {
        VerifyPinRequest request = new VerifyPinRequest();
        request.setPin("999999");

        mockMvc.perform(post("/api/public/gallery/" + gallerySlug + "/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("INVALID_PIN"));
    }

    @Test
    public void testCorrectPinReturnsSessionToken() throws Exception {
        VerifyPinRequest request = new VerifyPinRequest();
        request.setPin("482917");

        mockMvc.perform(post("/api/public/gallery/" + gallerySlug + "/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sessionToken").exists())
                .andExpect(jsonPath("$.data.publicSlug").value(gallerySlug));
    }

    @Test
    public void testGetPhotosWithoutSessionTokenFails() throws Exception {
        mockMvc.perform(get("/api/public/gallery/" + gallerySlug + "/photos"))
                .andExpect(status().isUnauthorized());
    }
}
