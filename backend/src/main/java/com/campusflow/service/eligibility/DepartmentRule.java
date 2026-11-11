package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Order(3)
public class DepartmentRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "Eligible Departments";
    }

    @Override
    public boolean isMandatory() {
        return true;
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        String studentDept = student.getDepartment() != null ? student.getDepartment().getCode() : "";
        String allowedDeptsStr = job.getEligibleDepartments() != null ? job.getEligibleDepartments() : "";

        Set<String> allowedDepts = Arrays.stream(allowedDeptsStr.split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        boolean passed = allowedDepts.isEmpty() || allowedDepts.contains(studentDept.toUpperCase());
        String message = passed
                ? String.format("Department (%s) is eligible for this opportunity", studentDept)
                : String.format("Department (%s) is not in eligible departments list (%s)", studentDept, allowedDeptsStr);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Department Code")
                .passed(passed)
                .requiredValue(allowedDeptsStr)
                .studentValue(studentDept)
                .message(message)
                .build();
    }
}
