package com.campusflow.controller;

import com.campusflow.dto.request.LoginRequest;
import com.campusflow.dto.request.PasswordResetRequest;
import com.campusflow.dto.request.RegisterRecruiterRequest;
import com.campusflow.dto.request.RegisterStudentRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.AuthResponse;
import com.campusflow.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication, registration and password recovery")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    @Operation(summary = "Register a new Student")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody RegisterStudentRequest req) {
        AuthResponse response = authService.registerStudent(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Student account created successfully", response));
    }

    @PostMapping("/register/recruiter")
    @Operation(summary = "Register a new Corporate Recruiter")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRecruiter(@Valid @RequestBody RegisterRecruiterRequest req) {
        AuthResponse response = authService.registerRecruiter(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Recruiter registration submitted for approval", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset account password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody PasswordResetRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
    }
}
