package com.campusflow.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferCreateRequest {

    @NotBlank(message = "Job designation is required")
    private String jobDesignation;

    @NotBlank(message = "Salary package is required")
    private String salaryPackage;

    @NotNull(message = "Joining date is required")
    @Future(message = "Joining date must be in the future")
    private LocalDate joiningDate;

    @NotNull(message = "Offer expiration date is required")
    @Future(message = "Expiration date must be in the future")
    private LocalDate offerExpirationDate;

    private String offerLetterUrl;
}
