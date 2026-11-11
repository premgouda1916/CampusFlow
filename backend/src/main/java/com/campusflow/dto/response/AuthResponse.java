package com.campusflow.dto.response;

import com.campusflow.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private boolean verified;
    private Long profileId; // Student ID or Recruiter ID
    private Long companyId; // If recruiter
    private String companyName;
}
