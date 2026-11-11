package com.campusflow.controller;

import com.campusflow.dto.request.OfferCreateRequest;
import com.campusflow.dto.request.OfferResponseRequest;
import com.campusflow.dto.response.ApiResponse;
import com.campusflow.dto.response.OfferResponse;
import com.campusflow.security.SecurityUserPrincipal;
import com.campusflow.service.OfferService;
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
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
@Tag(name = "Offer Management", description = "Endpoints for job offers, candidate acceptance, and placement finalization")
public class OfferController {

    private final OfferService offerService;

    @PostMapping("/applications/{applicationId}")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Extend job offer to candidate")
    public ResponseEntity<ApiResponse<OfferResponse>> createOffer(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody OfferCreateRequest req) {
        OfferResponse response = offerService.createOffer(applicationId, req, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Offer extended successfully", response));
    }

    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Accept or decline a formal employment offer")
    public ResponseEntity<ApiResponse<OfferResponse>> respondToOffer(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody OfferResponseRequest req) {
        OfferResponse response = offerService.respondToOffer(id, req, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Offer response recorded", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get offers extended to authenticated student")
    public ResponseEntity<ApiResponse<Page<OfferResponse>>> getMyOffers(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 10, sort = "issuedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OfferResponse> response = offerService.getMyOffers(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get all offers extended by recruiter company")
    public ResponseEntity<ApiResponse<Page<OfferResponse>>> getCompanyOffers(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PageableDefault(size = 20, sort = "issuedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<OfferResponse> response = offerService.getCompanyOffers(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

