package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class BacklogRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "Backlog Limit";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        int studentBacklogs = student.getBacklogCount() != null ? student.getBacklogCount() : 0;
        int maxBacklogs = job.getMaxBacklogs() != null ? job.getMaxBacklogs() : 0;

        boolean passed = studentBacklogs <= maxBacklogs;
        String message = passed
                ? String.format("Active backlogs (%d) are within allowable limit (%d)", studentBacklogs, maxBacklogs)
                : String.format("Active backlogs (%d) exceed maximum permitted limit (%d)", studentBacklogs, maxBacklogs);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Maximum Backlogs")
                .passed(passed)
                .requiredValue(String.valueOf(maxBacklogs))
                .studentValue(String.valueOf(studentBacklogs))
                .message(message)
                .build();
    }
}
