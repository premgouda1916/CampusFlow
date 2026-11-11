package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String website;
    private String industry;
    private String location;
    private String description;
    private boolean verified;
    private LocalDateTime createdAt;
    private long activeJobsCount;
}
