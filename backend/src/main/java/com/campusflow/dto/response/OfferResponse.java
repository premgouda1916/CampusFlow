package com.campusflow.dto.response;

import com.campusflow.entity.OfferStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private Long id;
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private Long companyId;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentUsn;
    private String jobDesignation;
    private String salaryPackage;
    private LocalDate joiningDate;
    private LocalDate offerExpirationDate;
    private OfferStatus status;
    private String offerLetterUrl;
    private LocalDateTime issuedAt;
    private LocalDateTime respondedAt;
    private boolean isExpired;
}

