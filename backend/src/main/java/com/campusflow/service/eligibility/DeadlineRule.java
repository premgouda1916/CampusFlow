package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
@Order(5)
public class DeadlineRule implements EligibilityRule {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm");

    @Override
    public String getRuleName() {
        return "Application Deadline";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        if (job.getApplicationDeadline() == null) {
            return CriterionEvaluation.builder()
                    .ruleName(getRuleName())
                    .criterionName("Deadline")
                    .passed(true)
                    .requiredValue("Open")
                    .studentValue("Active")
                    .message("No application deadline specified")
                    .build();
        }

        boolean passed = context.getEvaluationTime().isBefore(job.getApplicationDeadline());
        String formattedDeadline = job.getApplicationDeadline().format(FORMATTER);
        String message = passed
                ? String.format("Application window is open until %s", formattedDeadline)
                : String.format("Application deadline passed on %s", formattedDeadline);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Application Deadline")
                .passed(passed)
                .requiredValue(formattedDeadline)
                .studentValue(context.getEvaluationTime().format(FORMATTER))
                .message(message)
                .build();
    }
}
