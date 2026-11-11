package com.campusflow.dto.response;

import com.campusflow.entity.ApplicationStatus;
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
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long companyId;
    private String companyName;
    private String salaryPackage;
    private String location;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String studentUsn;
    private String studentDepartment;
    private BigDecimal studentCgpa;
    private Integer studentBacklogs;
    private String studentResumeUrl;
    private String studentSkills;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String notes;
}

