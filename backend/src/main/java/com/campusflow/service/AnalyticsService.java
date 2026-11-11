package com.campusflow.service;

import com.campusflow.dto.response.AuditLogResponse;
import com.campusflow.dto.response.DashboardStatsResponse.*;
import com.campusflow.entity.*;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.*;
import com.campusflow.service.eligibility.EligibilityEngine;
import com.campusflow.service.eligibility.EvaluationContext;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Writer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final PlacementDriveRepository driveRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final EligibilityEngine eligibilityEngine;

    @Transactional(readOnly = true)
    public StudentDashboard getStudentDashboard(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        long totalAvailableJobs = jobRepository.countByStatus(JobStatus.PUBLISHED);

        List<Job> activeJobs = jobRepository.findActiveJobs(JobStatus.PUBLISHED, LocalDateTime.now());
        long eligibleJobs = activeJobs.stream()
                .filter(job -> {
                    boolean already = applicationRepository.existsByJobIdAndStudentId(job.getId(), student.getId());
                    EvaluationContext ctx = EvaluationContext.builder().alreadyApplied(already).build();
                    return eligibilityEngine.evaluate(student, job, ctx).isEligible();
                })
                .count();

        long applicationsSubmitted = applicationRepository.countByStudentId(student.getId());
        long shortlisted = applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.SHORTLISTED);
        long interviews = interviewRepository.findByStudentId(student.getId()).stream()
                .filter(i -> i.getStatus() == InterviewStatus.SCHEDULED)
                .count();
        long offers = offerRepository.countByStudentId(student.getId());

        // Calculate profile completion percentage
        int score = 20; // Basic account exists
        if (student.getUsn() != null && !student.getUsn().isEmpty()) score += 15;
        if (student.getDepartment() != null) score += 15;
        if (student.getCurrentCgpa() != null && student.getCurrentCgpa().doubleValue() > 0) score += 15;
        if (student.getSkills() != null && !student.getSkills().isEmpty()) score += 15;
        if (student.getResumeUrl() != null && !student.getResumeUrl().isEmpty()) score += 20;

        return StudentDashboard.builder()
                .totalAvailableJobs(totalAvailableJobs)
                .eligibleJobsCount(eligibleJobs)
                .applicationsSubmitted(applicationsSubmitted)
                .shortlistedApplications(shortlisted)
                .upcomingInterviews(interviews)
                .offersReceived(offers)
                .profileCompletionPercentage(score)
                .build();
    }

    @Transactional(readOnly = true)
    public RecruiterDashboard getRecruiterDashboard(Long recruiterUserId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Long companyId = recruiter.getCompany().getId();

        long totalJobs = jobRepository.countByCompanyId(companyId);
        long activeJobs = jobRepository.findAll().stream()
                .filter(j -> j.getCompany().getId().equals(companyId) && j.getStatus() == JobStatus.PUBLISHED)
                .count();

        long totalApplicants = applicationRepository.findAll().stream()
                .filter(a -> a.getJob().getCompany().getId().equals(companyId))
                .count();

        long shortlisted = applicationRepository.findAll().stream()
                .filter(a -> a.getJob().getCompany().getId().equals(companyId) && a.getStatus() == ApplicationStatus.SHORTLISTED)
                .count();

        long interviews = interviewRepository.countByCompanyId(companyId);
        long offersIssued = offerRepository.countByCompanyId(companyId);
        long offersAccepted = offerRepository.countByCompanyIdAndStatus(companyId, OfferStatus.ACCEPTED);

        return RecruiterDashboard.builder()
                .totalJobsPosted(totalJobs)
                .activeJobs(activeJobs)
                .totalApplicants(totalApplicants)
                .shortlistedCandidates(shortlisted)
                .scheduledInterviews(interviews)
                .offersIssued(offersIssued)
                .offersAccepted(offersAccepted)
                .build();
    }

    @Transactional(readOnly = true)
    public PlacementOfficerDashboard getPlacementOfficerDashboard() {
        long totalStudents = studentRepository.count();
        long placedStudents = studentRepository.countByPlacedTrue();
        double placementRate = totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100.0 : 0.0;

        long verifiedCompanies = companyRepository.countByVerifiedTrue();
        long publishedJobs = jobRepository.countByStatus(JobStatus.PUBLISHED);
        long totalOffers = offerRepository.count();

        // Calculate Department-wise placement stats
        List<Department> departments = departmentRepository.findByActiveTrue();
        List<DepartmentPlacementStat> deptStats = new ArrayList<>();
        for (Department dept : departments) {
            long deptTotal = studentRepository.countByDepartmentId(dept.getId());
            long deptPlaced = studentRepository.findAll().stream()
                    .filter(s -> s.getDepartment().getId().equals(dept.getId()) && s.isPlaced())
                    .count();
            double rate = deptTotal > 0 ? ((double) deptPlaced / deptTotal) * 100.0 : 0.0;

            deptStats.add(DepartmentPlacementStat.builder()
                    .departmentCode(dept.getCode())
                    .departmentName(dept.getName())
                    .totalStudents(deptTotal)
                    .placedStudents(deptPlaced)
                    .placementRate(Math.round(rate * 10.0) / 10.0)
                    .build());
        }

        // Calculate Salary Packages (extracting numbers from "24 LPA", "18 LPA", etc.)
        List<Offer> allOffers = offerRepository.findAll();
        List<Double> packages = new ArrayList<>();
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)");

        for (Offer offer : allOffers) {
            if (offer.getSalaryPackage() != null) {
                Matcher m = pattern.matcher(offer.getSalaryPackage());
                if (m.find()) {
                    try {
                        packages.add(Double.parseDouble(m.group(1)));
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        double highestLpa = packages.stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        double avgLpa = packages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        // Top Hiring Companies
        Map<String, Long> companyOffers = allOffers.stream()
                .collect(Collectors.groupingBy(o -> o.getApplication().getJob().getCompany().getName(), Collectors.counting()));

        List<CompanyPlacementStat> topCompanies = companyOffers.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> CompanyPlacementStat.builder()
                        .companyName(e.getKey())
                        .offersCount(e.getValue())
                        .averagePackage("Competitive")
                        .build())
                .toList();

        return PlacementOfficerDashboard.builder()
                .totalRegisteredStudents(totalStudents)
                .totalPlacedStudents(placedStudents)
                .placementPercentage(Math.round(placementRate * 10.0) / 10.0)
                .averageSalaryPackageLpa(Math.round(avgLpa * 10.0) / 10.0)
                .highestSalaryPackageLpa(Math.round(highestLpa * 10.0) / 10.0)
                .activeRecruiterCompanies(verifiedCompanies)
                .totalJobsPublished(publishedJobs)
                .totalOffersIssued(totalOffers)
                .departmentStats(deptStats)
                .topHiringCompanies(topCompanies)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminDashboard getAdminDashboard() {
        long totalUsers = userRepository.count();
        long students = studentRepository.count();
        long recruiters = recruiterRepository.count();
        long verifiedCompanies = companyRepository.countByVerifiedTrue();
        long pendingCompanies = companyRepository.findAll().stream().filter(c -> !c.isVerified()).count();
        long pendingRecruiters = recruiterRepository.countByApprovedFalse();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long totalAuditLogs = auditLogRepository.count();

        List<AuditLogResponse> recentActivity = auditLogRepository.findTop20ByOrderByTimestampDesc()
                .stream()
                .map(EntityMapper::toAuditLogResponse)
                .toList();

        return AdminDashboard.builder()
                .totalUsers(totalUsers)
                .totalStudents(students)
                .totalRecruiters(recruiters)
                .verifiedCompanies(verifiedCompanies)
                .pendingCompanyApprovals(pendingCompanies)
                .pendingRecruiterApprovals(pendingRecruiters)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .totalAuditLogs(totalAuditLogs)
                .recentActivity(recentActivity)
                .build();
    }

    @Transactional(readOnly = true)
    public void exportPlacementReportCsv(Writer writer) throws IOException {
        List<Offer> offers = offerRepository.findAll();
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader("Offer ID", "Student Name", "USN", "Department", "Company", "Job Title", "Salary Package", "Joining Date", "Status")
                .build();

        try (CSVPrinter printer = new CSVPrinter(writer, format)) {
            for (Offer o : offers) {
                printer.printRecord(
                        o.getId(),
                        o.getApplication().getStudent().getUser().getFullName(),
                        o.getApplication().getStudent().getUsn(),
                        o.getApplication().getStudent().getDepartment().getCode(),
                        o.getApplication().getJob().getCompany().getName(),
                        o.getJobDesignation(),
                        o.getSalaryPackage(),
                        o.getJoiningDate(),
                        o.getStatus()
                );
            }
        }
    }
}

