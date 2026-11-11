package com.campusflow.controller;

import com.campusflow.dto.request.PlacementDriveRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.entity.PlacementDrive;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.PlacementDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/placement/drives")
@RequiredArgsConstructor
@Tag(name = "Placement Drives", description = "Endpoints for institutional campus placement seasons and drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    @GetMapping
    @Operation(summary = "List all campus placement drives")
    public ResponseEntity<ApiResponse<List<PlacementDrive>>> getAllDrives() {
        List<PlacementDrive> drives = driveService.getAllDrives();
        return ResponseEntity.ok(ApiResponse.success(drives));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get placement drive details by ID")
    public ResponseEntity<ApiResponse<PlacementDrive>> getDriveById(@PathVariable Long id) {
        PlacementDrive drive = driveService.getDriveById(id);
        return ResponseEntity.ok(ApiResponse.success(drive));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Create a new campus placement drive")
    public ResponseEntity<ApiResponse<PlacementDrive>> createDrive(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody PlacementDriveRequest req) {
        PlacementDrive drive = driveService.createDrive(req, principal.getId(), principal.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Placement drive created", drive));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Update placement drive schedule or details")
    public ResponseEntity<ApiResponse<PlacementDrive>> updateDrive(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody PlacementDriveRequest req) {
        PlacementDrive drive = driveService.updateDrive(id, req, principal.getId(), principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Placement drive updated", drive));
    }
}
