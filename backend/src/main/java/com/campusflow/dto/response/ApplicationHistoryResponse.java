package com.campusflow.dto.response;

import com.campusflow.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationHistoryResponse {
    private Long id;
    private Long applicationId;
    private ApplicationStatus fromStatus;
    private ApplicationStatus toStatus;
    private Long changedByUserId;
    private String changedByUserName;
    private String comment;
    private LocalDateTime changedAt;
}
