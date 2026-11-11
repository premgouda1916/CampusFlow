package com.campusflow.dto.request;

import jakarta.validation.constraints.*;
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
public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Job type is required")
    private String jobType;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Salary package is required")
    private String salaryPackage;

    @NotNull(message = "Minimum CGPA is required")
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "10.00")
    private BigDecimal minCgpa;

    @NotNull(message = "Maximum backlogs is required")
    @Min(0)
    private Integer maxBacklogs;

    @NotBlank(message = "Eligible departments are required (e.g. CSE, ISE)")
    private String eligibleDepartments;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    private String requiredSkills;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Application deadline must be in the future")
    private LocalDateTime applicationDeadline;

    private Long placementDriveId;
}

