package com.campusflow.controller;

import com.campusflow.dto.request.StudentProfileUpdateRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.StudentResponse;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "Endpoints for student profile, academic records, and resume management")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current authenticated student's profile")
    public ResponseEntity<ApiResponse<StudentResponse>> getMyProfile(@AuthenticationPrincipal SecurityUserPrincipal principal) {
        StudentResponse response = studentService.getProfileByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update current student profile")
    public ResponseEntity<ApiResponse<StudentResponse>> updateMyProfile(@AuthenticationPrincipal SecurityUserPrincipal principal,
                                                                        @Valid @RequestBody StudentProfileUpdateRequest req) {
        StudentResponse response = studentService.updateProfile(principal.getId(), req);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping(value = "/me/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Upload candidate resume PDF/DOC")
    public ResponseEntity<ApiResponse<String>> uploadResume(@AuthenticationPrincipal SecurityUserPrincipal principal,
                                                            @RequestParam("file") MultipartFile file) {
        String url = studentService.uploadResume(principal.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", url));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Get student profile by ID")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN', 'RECRUITER')")
    @Operation(summary = "List and filter student directory")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> listStudents(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Integer graduationYear,
            @RequestParam(required = false) Boolean isPlaced,
            @PageableDefault(size = 20, sort = "currentCgpa", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<StudentResponse> response = studentService.getAllStudents(departmentId, graduationYear, isPlaced, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

