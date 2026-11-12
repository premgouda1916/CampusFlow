package com.campusflow.integration;

import com.campusflow.dto.request.LoginRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WorkflowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.path("data").path("token").asText();
    }

    @Test
    @DisplayName("Recruiter should be able to read placement drives when creating job postings")
    void recruiterCanReadPlacementDrives() throws Exception {
        String token = loginAndGetToken("recruiter.google@campusflow.com", "password123");

        mockMvc.perform(get("/api/v1/placement/drives")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("Placement Officer should be able to fetch placement offers & search students")
    void officerCanViewPlacementOffersAndSearchStudents() throws Exception {
        String token = loginAndGetToken("officer@campusflow.com", "password123");

        mockMvc.perform(get("/api/v1/analytics/placement/offers")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        mockMvc.perform(get("/api/v1/students")
                        .param("search", "Arjun")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.content", hasSize(1)))
                .andExpect(jsonPath("$.data.content[0].usn", is("1MS21CS001")));
    }

    @Test
    @DisplayName("Student eligibility endpoint should return verified DTO schema")
    void studentEligibilityReturnsVerifiedSchema() throws Exception {
        String token = loginAndGetToken("arjun.sharma@campusflow.com", "password123");

        mockMvc.perform(get("/api/v1/jobs/3/eligibility")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.jobId", is(3)))
                .andExpect(jsonPath("$.data.overallMatchScore", notNullValue()))
                .andExpect(jsonPath("$.data.criteriaEvaluations", not(empty())))
                .andExpect(jsonPath("$.data.eligible", is(true)));
    }
}

