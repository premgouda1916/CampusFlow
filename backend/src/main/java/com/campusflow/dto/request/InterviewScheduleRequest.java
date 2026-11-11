package com.campusflow.dto.request;

import com.campusflow.entity.InterviewMode;
import com.campusflow.entity.InterviewRound;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewScheduleRequest {

    @NotNull(message = "Round name is required")
    private InterviewRound roundName;

    @NotNull(message = "Scheduled time is required")
    @Future(message = "Interview scheduled time must be in the future")
    private LocalDateTime scheduledAt;

    @NotNull(message = "Interview mode is required")
    private InterviewMode mode;

    @NotBlank(message = "Location or meeting link is required")
    private String locationOrLink;

    private String instructions;
}

