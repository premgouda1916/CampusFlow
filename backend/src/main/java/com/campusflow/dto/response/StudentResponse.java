package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String phone;
    private String usn;
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String collegeName;
    private Integer graduationYear;
    private BigDecimal currentCgpa;
    private Integer backlogCount;
    private String skills;
    private String resumeUrl;
    private String profilePhotoUrl;
    private boolean placed;
}
