package com.campusflow.controller;

import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.RecruiterResponse;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recruiters")
@RequiredArgsConstructor
@Tag(name = "Recruiter Management", description = "Endpoints for corporate recruiter accounts and approval workflows")
public class RecruiterController {

    private final RecruiterService recruiterService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get current recruiter profile")
    public ResponseEntity<ApiResponse<RecruiterResponse>> getMyProfile(@AuthenticationPrincipal SecurityUserPrincipal principal) {
        RecruiterResponse response = recruiterService.getProfileByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "List recruiters pending administrative approval")
    public ResponseEntity<ApiResponse<Page<RecruiterResponse>>> getPendingRecruiters(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<RecruiterResponse> response = recruiterService.getRecruitersByApprovalStatus(false, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Approve or decline recruiter access")
    public ResponseEntity<ApiResponse<RecruiterResponse>> approveRecruiter(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        RecruiterResponse response = recruiterService.approveRecruiter(id, approved, principal.getId(), principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Recruiter approval status updated", response));
    }
}

