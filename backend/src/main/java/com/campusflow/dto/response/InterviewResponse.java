package com.campusflow.dto.response;

import com.campusflow.entity.InterviewMode;
import com.campusflow.entity.InterviewRound;
import com.campusflow.entity.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private Long companyId;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String studentUsn;
    private Long recruiterId;
    private String recruiterName;
    private InterviewRound roundName;
    private LocalDateTime scheduledAt;
    private InterviewMode mode;
    private String locationOrLink;
    private String instructions;
    private InterviewStatus status;
    private String feedback;
}

