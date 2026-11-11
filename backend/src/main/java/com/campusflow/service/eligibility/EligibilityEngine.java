package com.campusflow.service.eligibility;

import com.campusflow.dto.response.CriterionEvaluation;
import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.entity.Job;
import com.campusflow.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EligibilityEngine {

    private final List<EligibilityRule> rules;

    public EligibilityResult evaluate(Student student, Job job, EvaluationContext context) {
        List<CriterionEvaluation> criteriaEvaluations = new ArrayList<>();
        List<String> rejectionReasons = new ArrayList<>();
        boolean isEligible = true;

        for (EligibilityRule rule : rules) {
            CriterionEvaluation eval = rule.evaluate(student, job, context);
            criteriaEvaluations.add(eval);

            if (!eval.isPassed()) {
                if (rule.isMandatory()) {
                    isEligible = false;
                    rejectionReasons.add(eval.getMessage());
                }
            }
        }

        // Skills analysis
        Set<String> requiredSkills = SkillMatchRule.parseSkills(job.getRequiredSkills());
        Set<String> studentSkills = SkillMatchRule.parseSkills(student.getSkills());

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String req : requiredSkills) {
            boolean found = studentSkills.stream()
                    .anyMatch(s -> s.equalsIgnoreCase(req) || s.toLowerCase().contains(req.toLowerCase()) || req.toLowerCase().contains(s.toLowerCase()));
            if (found) {
                matchedSkills.add(req);
            } else {
                missingSkills.add(req);
            }
        }

        // Overall match score calculation
        long passedMandatory = criteriaEvaluations.stream()
                .filter(CriterionEvaluation::isPassed)
                .count();
        double criteriaRatio = (double) passedMandatory / criteriaEvaluations.size();
        double skillRatio = requiredSkills.isEmpty() ? 1.0 : ((double) matchedSkills.size() / requiredSkills.size());
        double overallScore = Math.round(((criteriaRatio * 0.70) + (skillRatio * 0.30)) * 100.0);

        boolean deadlinePassed = job.getApplicationDeadline() != null && context.getEvaluationTime().isAfter(job.getApplicationDeadline());

        return EligibilityResult.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .studentId(student.getId())
                .studentName(student.getUser().getFullName())
                .eligible(isEligible)
                .overallMatchScore(overallScore)
                .criteriaEvaluations(criteriaEvaluations)
                .rejectionReasons(rejectionReasons)
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .alreadyApplied(context.isAlreadyApplied())
                .deadlinePassed(deadlinePassed)
                .build();
    }
}

