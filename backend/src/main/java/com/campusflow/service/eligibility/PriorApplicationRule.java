package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(6)
public class PriorApplicationRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "Application Uniqueness";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        boolean passed = !context.isAlreadyApplied();
        String message = passed
                ? "No prior application submitted for this role"
                : "You have already submitted an application for this position";

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Prior Application Check")
                .passed(passed)
                .requiredValue("Not Applied")
                .studentValue(context.isAlreadyApplied() ? "Already Applied" : "None")
                .message(message)
                .build();
    }
}

