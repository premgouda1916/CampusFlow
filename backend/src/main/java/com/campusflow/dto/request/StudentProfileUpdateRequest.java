package com.campusflow.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileUpdateRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    private String collegeName;

    private Integer graduationYear;

    @DecimalMin(value = "0.00", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.0")
    private BigDecimal currentCgpa;

    @Min(value = 0, message = "Backlog count cannot be negative")
    private Integer backlogCount;

    private String skills;
}
