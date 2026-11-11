package com.campusflow.integration;

import com.campusflow.dto.request.LoginRequest;
import com.campusflow.dto.request.RegisterStudentRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/login with valid student credentials should return JWT token")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("arjun.sharma@campusflow.com", "password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.email", is("arjun.sharma@campusflow.com")))
                .andExpect(jsonPath("$.data.role", is("STUDENT")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login with invalid password should return 401 Unauthorized")
    void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest("arjun.sharma@campusflow.com", "wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register/student should create new student profile and issue JWT")
    void testRegisterNewStudent() throws Exception {
        RegisterStudentRequest request = RegisterStudentRequest.builder()
                .email("neha.sharma@campusflow.com")
                .password("password123")
                .fullName("Neha Sharma")
                .phone("+91 9123456789")
                .usn("1MS21CS099")
                .departmentCode("CSE")
                .collegeName("M.S. Ramaiah Institute of Technology")
                .graduationYear(2027)
                .currentCgpa(BigDecimal.valueOf(8.75))
                .backlogCount(0)
                .skills("Java, React, SQL")
                .build();

        mockMvc.perform(post("/api/v1/auth/register/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.email", is("neha.sharma@campusflow.com")));
    }
}
