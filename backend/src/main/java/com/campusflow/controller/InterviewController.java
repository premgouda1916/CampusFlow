package com.campusflow.controller;

import com.campusflow.dto.request.InterviewFeedbackRequest;
import com.campusflow.dto.request.InterviewScheduleRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.InterviewResponse;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.InterviewService;
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

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
@Tag(name = "Interview Management", description = "Endpoints for scheduling, candidate notification, and recording round feedback")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/applications/{applicationId}")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Schedule interview round for an applicant")
    public ResponseEntity<ApiResponse<InterviewResponse>> scheduleInterview(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody InterviewScheduleRequest req) {
        InterviewResponse response = interviewService.scheduleInterview(applicationId, req, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Interview scheduled successfully", response));
    }

    @PatchMapping("/{id}/feedback")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Submit interview feedback and outcome status")
    public ResponseEntity<ApiResponse<InterviewResponse>> updateFeedback(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody InterviewFeedbackRequest req) {
        InterviewResponse response = interviewService.updateFeedback(id, req, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Interview status updated", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get upcoming interviews for authenticated student")
    public ResponseEntity<ApiResponse<Page<InterviewResponse>>> getMyInterviews(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 15, sort = "scheduledAt", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<InterviewResponse> response = interviewService.getMyInterviews(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all scheduled interviews for corporate recruiter")
    public ResponseEntity<ApiResponse<Page<InterviewResponse>>> getCompanyInterviews(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 20, sort = "scheduledAt", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<InterviewResponse> response = interviewService.getCompanyInterviews(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
