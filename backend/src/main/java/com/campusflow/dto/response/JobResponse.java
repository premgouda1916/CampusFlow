package com.campusflow.dto.response;

import com.campusflow.entity.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyWebsite;
    private Long placementDriveId;
    private String placementDriveTitle;
    private Long recruiterId;
    private String recruiterName;
    private String title;
    private String description;
    private String jobType;
    private String location;
    private String salaryPackage;
    private BigDecimal minCgpa;
    private Integer maxBacklogs;
    private String eligibleDepartments;
    private Integer graduationYear;
    private String requiredSkills;
    private LocalDateTime applicationDeadline;
    private JobStatus status;
    private LocalDateTime createdAt;
    private long totalApplicants;
    private boolean isExpired;
    private Boolean userEligible; // Computed if student is querying
}

