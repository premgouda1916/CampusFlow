package com.campusflow.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterStudentRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    @NotBlank(message = "USN is required")
    private String usn;

    @NotBlank(message = "Department code is required")
    private String departmentCode;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotNull(message = "Graduation year is required")
    @Min(value = 2020, message = "Graduation year must be valid")
    private Integer graduationYear;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.00", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.00", message = "CGPA cannot exceed 10.0")
    private BigDecimal currentCgpa;

    @NotNull(message = "Backlog count is required")
    @Min(value = 0, message = "Backlog count cannot be negative")
    private Integer backlogCount;

    private String skills;
}

