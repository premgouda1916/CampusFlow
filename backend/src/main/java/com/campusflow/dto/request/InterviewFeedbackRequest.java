package com.campusflow.dto.request;

import com.campusflow.entity.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewFeedbackRequest {

    @NotNull(message = "Interview status is required")
    private InterviewStatus status;

    private String feedback;
}
