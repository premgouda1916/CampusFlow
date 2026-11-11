package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;

public interface EligibilityRule {
    String getRuleName();
    CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context);
    boolean isMandatory();
}

