package com.campusflow.controller;

import com.campusflow.dto.request.CompanyCreateRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.CompanyResponse;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.CompanyService;
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
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Tag(name = "Company Management", description = "Endpoints for enterprise company profiles and verification")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "List registered companies")
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> getCompanies(
            @RequestParam(required = false) Boolean verified,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<CompanyResponse> response = companyService.getCompanies(verified, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompanyById(@PathVariable Long id) {
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Register a new company")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody CompanyCreateRequest req) {
        CompanyResponse response = companyService.createCompany(req, principal.getId(), principal.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Company created successfully", response));
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('PLACEMENT_OFFICER', 'ADMIN')")
    @Operation(summary = "Approve or revoke company verification")
    public ResponseEntity<ApiResponse<CompanyResponse>> verifyCompany(
            @PathVariable Long id,
            @RequestParam boolean verified,
            @AuthenticationPrincipal SecurityUserPrincipal principal) {
        CompanyResponse response = companyService.verifyCompany(id, verified, principal.getId(), principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Company verification updated", response));
    }
}
