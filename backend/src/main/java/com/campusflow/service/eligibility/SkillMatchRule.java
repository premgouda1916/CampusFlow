package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Order(7)
public class SkillMatchRule implements EligibilityRule {

    @Override
    public String getRuleName() {
        return "Skill Compatibility";
    }

    @Override
    public boolean isMandatory() {
        return false; // Skills match contributes to overall score and missing skills analysis
    }

    @Override
    public CriterionEvaluation evaluate(Student student, Job job, EvaluationContext context) {
        String requiredStr = job.getRequiredSkills() != null ? job.getRequiredSkills() : "";
        String studentStr = student.getSkills() != null ? student.getSkills() : "";

        Set<String> requiredSet = parseSkills(requiredStr);
        Set<String> studentSet = parseSkills(studentStr);

        if (requiredSet.isEmpty()) {
            return CriterionEvaluation.builder()
                    .ruleName(getRuleName())
                    .criterionName("Technical Skills")
                    .passed(true)
                    .requiredValue("None specified")
                    .studentValue(studentStr)
                    .message("No mandatory technical skills prerequisite")
                    .build();
        }

        Set<String> matched = new HashSet<>();
        Set<String> missing = new HashSet<>();

        for (String req : requiredSet) {
            boolean found = studentSet.stream()
                    .anyMatch(s -> s.equalsIgnoreCase(req) || s.toLowerCase().contains(req.toLowerCase()) || req.toLowerCase().contains(s.toLowerCase()));
            if (found) {
                matched.add(req);
            } else {
                missing.add(req);
            }
        }

        double matchRatio = (double) matched.size() / requiredSet.size();
        boolean passed = matchRatio >= 0.50; // Pass if at least 50% skills matched

        String message = String.format("Matched %d of %d required skills (%.0f%%)",
                matched.size(), requiredSet.size(), matchRatio * 100);

        return CriterionEvaluation.builder()
                .ruleName(getRuleName())
                .criterionName("Technical Skills Match")
                .passed(passed)
                .requiredValue(String.join(", ", requiredSet))
                .studentValue(String.join(", ", matched))
                .message(message)
                .build();
    }

    public static Set<String> parseSkills(String str) {
        if (str == null || str.trim().isEmpty()) {
            return Collections.emptySet();
        }
        return Arrays.stream(str.split("[,;\\n]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
