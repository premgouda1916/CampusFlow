package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class GraduationYearRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "Graduation Batch";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        int studentBatch = student.getGraduationYear() != null ? student.getGraduationYear() : 0;
        int requiredBatch = job.getGraduationYear() != null ? job.getGraduationYear() : 0;

        boolean passed = studentBatch == requiredBatch;
        String message = passed
                ? String.format("Graduation batch (%d) matches qualifying criteria", studentBatch)
                : String.format("Graduation batch (%d) does not match required batch (%d)", studentBatch, requiredBatch);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Graduation Year")
                .passed(passed)
                .requiredValue(String.valueOf(requiredBatch))
                .studentValue(String.valueOf(studentBatch))
                .message(message)
                .build();
    }
}

