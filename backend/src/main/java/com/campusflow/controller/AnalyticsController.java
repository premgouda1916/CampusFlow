package com.campusflow.controller;

import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.DashboardStatsResponse.*;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics & Reports", description = "Endpoints for real-time dynamic dashboard statistics and reporting")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get personalized student dashboard statistics")
    public ResponseEntity<ApiResponse<StudentDashboard>> getStudentStats(
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        StudentDashboard stats = analyticsService.getStudentDashboard(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get corporate recruiter dashboard statistics")
    public ResponseEntity<ApiResponse<RecruiterDashboard>> getRecruiterStats(
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        RecruiterDashboard stats = analyticsService.getRecruiterDashboard(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/placement")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Get campus placement cell aggregate statistics")
    public ResponseEntity<ApiResponse<PlacementOfficerDashboard>> getPlacementOfficerStats() {
        PlacementOfficerDashboard stats = analyticsService.getPlacementOfficerDashboard();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get system-wide platform administration metrics")
    public ResponseEntity<ApiResponse<AdminDashboard>> getAdminStats() {
        AdminDashboard stats = analyticsService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/placement/export-csv")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Download placement outcomes report as CSV")
    public void exportPlacementReportCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"campusflow_placement_report.csv\"");
        analyticsService.exportPlacementReportCsv(response.getWriter());
    }
}
