package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(1)
public class CgpaRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "CGPA Requirement";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        BigDecimal studentCgpa = student.getCurrentCgpa() != null ? student.getCurrentCgpa() : BigDecimal.ZERO;
        BigDecimal minCgpa = job.getMinCgpa() != null ? job.getMinCgpa() : BigDecimal.ZERO;

        boolean passed = studentCgpa.compareTo(minCgpa) >= 0;
        String message = passed
                ? String.format("Current CGPA (%.2f) meets the minimum requirement (%.2f)", studentCgpa, minCgpa)
                : String.format("Current CGPA (%.2f) is below the required minimum (%.2f)", studentCgpa, minCgpa);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Minimum CGPA")
                .passed(passed)
                .requiredValue(minCgpa.toPlainString())
                .studentValue(studentCgpa.toPlainString())
                .message(message)
                .build();
    }
}
