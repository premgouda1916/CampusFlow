package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruiterResponse {
    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String phone;
    private Long companyId;
    private String companyName;
    private String designation;
    private boolean approved;
}
