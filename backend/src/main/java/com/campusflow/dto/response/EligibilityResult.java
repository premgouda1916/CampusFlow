package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResult {

    private Long jobId;
    private String jobTitle;
    private Long studentId;
    private String studentName;

    private boolean eligible;
    private double overallMatchScore; // Percentage 0 - 100

    @Builder.Default
    private List<CriterionEvaluation> criteriaEvaluations = new ArrayList<>();

    @Builder.Default
    private List<String> rejectionReasons = new ArrayList<>();

    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Builder.Default
    private List<String> matchedSkills = new ArrayList<>();

    private boolean alreadyApplied;
    private boolean deadlinePassed;
}

