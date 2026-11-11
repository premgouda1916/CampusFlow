package com.campusflow.service;

import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.entity.*;
import com.campusflow.service.eligibility.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityEngineTest {

    private EligibilityEngine eligibilityEngine;

    @BeforeEach
    void setUp() {
        List<EligibilityRule> rules = List.of(
                new CgpaRule(),
                new BacklogRule(),
                new DepartmentRule(),
                new GraduationYearRule(),
                new DeadlineRule(),
                new PriorApplicationRule(),
                new SkillMatchRule()
        );
        eligibilityEngine = new EligibilityEngine(rules);
    }

    private Student createMockStudent(String deptCode, double cgpa, int backlogs, int gradYear, String skills) {
        User user = User.builder()
                .id(100L)
                .email("student@test.com")
                .fullName("Test Student")
                .role(Role.STUDENT)
                .build();

        Department dept = Department.builder()
                .id(1L)
                .code(deptCode)
                .name(deptCode + " Dept")
                .build();

        return Student.builder()
                .id(10L)
                .user(user)
                .usn("1TEST001")
                .department(dept)
                .collegeName("Test College")
                .graduationYear(gradYear)
                .currentCgpa(BigDecimal.valueOf(cgpa))
                .backlogCount(backlogs)
                .skills(skills)
                .placed(false)
                .build();
    }

    private Job createMockJob(double minCgpa, int maxBacklogs, String depts, int gradYear, String requiredSkills, LocalDateTime deadline) {
        return Job.builder()
                .id(50L)
                .title("Software Development Engineer")
                .company(Company.builder().id(1L).name("Acme Corp").verified(true).build())
                .minCgpa(BigDecimal.valueOf(minCgpa))
                .maxBacklogs(maxBacklogs)
                .eligibleDepartments(depts)
                .graduationYear(gradYear)
                .requiredSkills(requiredSkills)
                .applicationDeadline(deadline)
                .status(JobStatus.PUBLISHED)
                .build();
    }

    @Test
    @DisplayName("Eligible candidate meeting all criteria should pass")
    void testEligibleCandidate() {
        Student student = createMockStudent("CSE", 8.50, 0, 2027, "Java, Spring Boot, MySQL, Docker");
        Job job = createMockJob(7.50, 0, "CSE,ISE,AIML", 2027, "Java, Spring Boot", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder()
                .evaluationTime(LocalDateTime.now())
                .alreadyApplied(false)
                .build();

        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertTrue(result.isEligible());
        assertTrue(result.getRejectionReasons().isEmpty());
        assertTrue(result.getMissingSkills().isEmpty());
        assertEquals(2, result.getMatchedSkills().size());
        assertTrue(result.getOverallMatchScore() >= 80.0);
    }

    @Test
    @DisplayName("Candidate with lower CGPA than requirement should be marked ineligible")
    void testIneligibleLowCgpa() {
        Student student = createMockStudent("CSE", 6.80, 0, 2027, "Java, Spring Boot");
        Job job = createMockJob(7.50, 0, "CSE,ISE", 2027, "Java", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder().evaluationTime(LocalDateTime.now()).build();
        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertFalse(result.isEligible());
        assertFalse(result.getRejectionReasons().isEmpty());
        assertTrue(result.getRejectionReasons().stream().anyMatch(r -> r.contains("CGPA")));
    }

    @Test
    @DisplayName("Candidate with active backlogs exceeding threshold should fail")
    void testIneligibleBacklogs() {
        Student student = createMockStudent("CSE", 8.20, 2, 2027, "Java");
        Job job = createMockJob(7.00, 0, "CSE", 2027, "Java", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder().evaluationTime(LocalDateTime.now()).build();
        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertFalse(result.isEligible());
        assertTrue(result.getRejectionReasons().stream().anyMatch(r -> r.contains("backlogs")));
    }

    @Test
    @DisplayName("Candidate from non-eligible department should fail")
    void testIneligibleDepartment() {
        Student student = createMockStudent("MECH", 8.50, 0, 2027, "Java");
        Job job = createMockJob(7.00, 0, "CSE,ISE,AIML", 2027, "Java", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder().evaluationTime(LocalDateTime.now()).build();
        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertFalse(result.isEligible());
        assertTrue(result.getRejectionReasons().stream().anyMatch(r -> r.contains("Department")));
    }

    @Test
    @DisplayName("Candidate applying after deadline has passed should fail")
    void testIneligiblePassedDeadline() {
        Student student = createMockStudent("CSE", 8.50, 0, 2027, "Java");
        Job job = createMockJob(7.00, 0, "CSE", 2027, "Java", LocalDateTime.now().minusDays(1));

        EvaluationContext context = EvaluationContext.builder().evaluationTime(LocalDateTime.now()).build();
        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertFalse(result.isEligible());
        assertTrue(result.isDeadlinePassed());
    }

    @Test
    @DisplayName("Candidate who has already applied should fail uniqueness rule")
    void testIneligibleAlreadyApplied() {
        Student student = createMockStudent("CSE", 8.50, 0, 2027, "Java");
        Job job = createMockJob(7.00, 0, "CSE", 2027, "Java", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder()
                .evaluationTime(LocalDateTime.now())
                .alreadyApplied(true)
                .build();

        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertFalse(result.isEligible());
        assertTrue(result.isAlreadyApplied());
    }

    @Test
    @DisplayName("Missing skills should be properly identified and categorized")
    void testMissingSkillsDetection() {
        Student student = createMockStudent("CSE", 8.50, 0, 2027, "Java, Git");
        Job job = createMockJob(7.00, 0, "CSE", 2027, "Java, Docker, Kubernetes, AWS", LocalDateTime.now().plusDays(10));

        EvaluationContext context = EvaluationContext.builder().evaluationTime(LocalDateTime.now()).build();
        EligibilityResult result = eligibilityEngine.evaluate(student, job, context);

        assertTrue(result.getMissingSkills().contains("Docker"));
        assertTrue(result.getMissingSkills().contains("Kubernetes"));
        assertTrue(result.getMissingSkills().contains("AWS"));
        assertTrue(result.getMatchedSkills().contains("Java"));
    }
}

