package com.campusflow.controller;

import com.campusflow.dto.request.JobCreateRequest;
import com.campusflow.dto.request.JobUpdateRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.dto.response.JobResponse;
import com.campusflow.entity.JobStatus;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.JobService;
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
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Job Vacancies", description = "Endpoints for creating, managing, searching, and evaluating eligibility for campus placements")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "Search, filter, and paginate published jobs")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Long currentUserId = principal != null ? principal.getId() : null;
        Page<JobResponse> response = jobService.searchJobs(status, companyId, search, currentUserId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed job specification")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        Long currentUserId = principal != null ? principal.getId() : null;
        JobResponse response = jobService.getJobById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/eligibility")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Evaluate student eligibility criteria for this job opening")
    public ResponseEntity<ApiResponse<EligibilityResult>> checkEligibility(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        EligibilityResult response = jobService.checkStudentEligibility(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Create a new placement job opportunity")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody JobCreateRequest req) {
        JobResponse response = jobService.createJob(req, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Job created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Update job vacancy description or eligibility requirements")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody JobUpdateRequest req) {
        JobResponse response = jobService.updateJob(id, req, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", response));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Publish job opening to campus student portal")
    public ResponseEntity<ApiResponse<JobResponse>> publishJob(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        JobResponse response = jobService.publishJob(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Job published successfully", response));
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Close job opening from accepting further submissions")
    public ResponseEntity<ApiResponse<JobResponse>> closeJob(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        JobResponse response = jobService.closeJob(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Job closed successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Delete job opening")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        jobService.deleteJob(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }
}
