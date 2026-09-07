package com.snapgallery.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.snapgallery.auth.AuthResponse;
import com.snapgallery.auth.LoginRequest;
import com.snapgallery.event.CreateEventRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
public class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String teamMemberToken;

    @BeforeEach
    public void setup() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("rahul@snapgallery.demo");
        loginRequest.setPassword("rahul123");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        AuthResponse response = objectMapper.readValue(
                objectMapper.readTree(content).get("data").toString(),
                AuthResponse.class
        );
        this.teamMemberToken = response.getToken();
    }

    @Test
    public void testTeamMemberCannotCreateEvent() throws Exception {
        CreateEventRequest createRequest = new CreateEventRequest();
        createRequest.setName("Unauthorized Event Attempt");
        createRequest.setEventDate(LocalDate.now());

        mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + teamMemberToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testTeamMemberCannotPublishGallery() throws Exception {
        mockMvc.perform(post("/api/galleries/fake-gallery-id/publish")
                .header("Authorization", "Bearer " + teamMemberToken))
                .andExpect(status().isForbidden());
    }
}
