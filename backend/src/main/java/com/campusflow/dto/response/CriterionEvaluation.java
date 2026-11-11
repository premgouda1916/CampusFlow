package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CriterionEvaluation {
    private String ruleName;
    private String criterionName;
    private boolean passed;
    private String requiredValue;
    private String studentValue;
    private String message;
}
