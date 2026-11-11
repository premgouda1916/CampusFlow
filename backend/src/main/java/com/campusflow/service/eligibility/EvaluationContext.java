package com.campusflow.service.eligibility;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationContext {

    @Builder.Default
    private LocalDateTime evaluationTime = LocalDateTime.now();

    @Builder.Default
    private boolean alreadyApplied = false;
}
