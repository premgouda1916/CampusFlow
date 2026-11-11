package com.campusflow.controller;

import com.campusflow.dto.request.ApplicationStatusUpdateRequest;
import com.campusflow.dto.request.ApplicationSubmitRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.ApplicationHistoryResponse;
import com.campusflow.dto.response.ApplicationResponse;
import com.campusflow.entity.ApplicationStatus;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "Application Management", description = "Endpoints for student job applications, recruiter reviews, and shortlisting")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply for an eligible job opening")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestBody(required = false) ApplicationSubmitRequest req) {
        ApplicationResponse response = applicationService.applyForJob(jobId, principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's submitted applications")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 15, sort = "appliedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getMyApplications(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Get candidate applications for a specific job")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 20, sort = "appliedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getJobApplications(jobId, status, principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all applications for current recruiter's enterprise")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getCompanyApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 20, sort = "appliedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getCompanyApplications(principal.getId(), status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        ApplicationResponse response = applicationService.getApplicationById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Update applicant status (e.g., SHORTLISTED, REJECTED)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest req,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        ApplicationResponse response = applicationService.updateStatus(id, req, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Application status updated", response));
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Withdraw application")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        applicationService.withdrawApplication(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully", null));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get lifecycle status progression audit history for an application")
    public ResponseEntity<ApiResponse<List<ApplicationHistoryResponse>>> getApplicationHistory(@PathVariable Long id) {
        List<ApplicationHistoryResponse> response = applicationService.getApplicationHistory(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
