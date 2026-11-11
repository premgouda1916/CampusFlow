package com.campusflow.service;

import com.campusflow.dto.request.JobCreateRequest;
import com.campusflow.dto.request.JobUpdateRequest;
import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.dto.response.JobResponse;
import com.campusflow.entity.*;
import com.campusflow.exception.BadRequestException;
import com.campusflow.exception.ForbiddenException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.*;
import com.campusflow.service.eligibility.EligibilityEngine;
import com.campusflow.service.eligibility.EvaluationContext;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final StudentRepository studentRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final ApplicationRepository applicationRepository;
    private final EligibilityEngine eligibilityEngine;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse createJob(JobCreateRequest req, Long recruiterUserId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only registered recruiters can post job vacancies"));

        if (!recruiter.isApproved()) {
            throw new ForbiddenException("Your recruiter account is pending approval by the placement administration");
        }

        Company company = recruiter.getCompany();

        PlacementDrive drive = null;
        if (req.getPlacementDriveId() != null) {
            drive = placementDriveRepository.findById(req.getPlacementDriveId()).orElse(null);
        }

        Job job = Job.builder()
                .company(company)
                .placementDrive(drive)
                .createdByRecruiter(recruiter)
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .jobType(req.getJobType())
                .location(req.getLocation())
                .salaryPackage(req.getSalaryPackage())
                .minCgpa(req.getMinCgpa())
                .maxBacklogs(req.getMaxBacklogs())
                .eligibleDepartments(req.getEligibleDepartments().toUpperCase().trim())
                .graduationYear(req.getGraduationYear())
                .requiredSkills(req.getRequiredSkills())
                .applicationDeadline(req.getApplicationDeadline())
                .status(JobStatus.DRAFT)
                .build();

        job = jobRepository.save(job);

        auditLogService.record(recruiterUserId, recruiter.getUser().getEmail(), "CREATE_JOB", "JOB",
                job.getId().toString(), "Created draft job vacancy: " + job.getTitle(), "127.0.0.1");

        return EntityMapper.toJobResponse(job, 0, null);
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse updateJob(Long jobId, JobUpdateRequest req, Long recruiterUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job vacancy not found with id: " + jobId));

        validateOwnership(job, recruiterUserId);

        job.setTitle(req.getTitle().trim());
        job.setDescription(req.getDescription());
        job.setJobType(req.getJobType());
        job.setLocation(req.getLocation());
        job.setSalaryPackage(req.getSalaryPackage());
        job.setMinCgpa(req.getMinCgpa());
        job.setMaxBacklogs(req.getMaxBacklogs());
        job.setEligibleDepartments(req.getEligibleDepartments().toUpperCase().trim());
        job.setGraduationYear(req.getGraduationYear());
        job.setRequiredSkills(req.getRequiredSkills());
        job.setApplicationDeadline(req.getApplicationDeadline());
        if (req.getStatus() != null) {
            job.setStatus(req.getStatus());
        }
        if (req.getPlacementDriveId() != null) {
            PlacementDrive drive = placementDriveRepository.findById(req.getPlacementDriveId()).orElse(null);
            job.setPlacementDrive(drive);
        }
        job.setUpdatedAt(LocalDateTime.now());

        job = jobRepository.save(job);

        long applicantCount = applicationRepository.countByJobId(jobId);
        return EntityMapper.toJobResponse(job, applicantCount, null);
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse publishJob(Long jobId, Long recruiterUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        validateOwnership(job, recruiterUserId);

        if (!job.getCompany().isVerified()) {
            throw new BadRequestException("Cannot publish job: Company '" + job.getCompany().getName() + "' is not yet verified by placement officers");
        }

        job.setStatus(JobStatus.PUBLISHED);
        job.setUpdatedAt(LocalDateTime.now());
        job = jobRepository.save(job);

        auditLogService.record(recruiterUserId, job.getCreatedByRecruiter().getUser().getEmail(), "PUBLISH_JOB",
                "JOB", job.getId().toString(), "Published job posting: " + job.getTitle(), "127.0.0.1");

        // Notify matching students about new job
        notifyEligibleStudents(job);

        long applicantCount = applicationRepository.countByJobId(jobId);
        return EntityMapper.toJobResponse(job, applicantCount, null);
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse closeJob(Long jobId, Long recruiterUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        validateOwnership(job, recruiterUserId);

        job.setStatus(JobStatus.CLOSED);
        job.setUpdatedAt(LocalDateTime.now());
        job = jobRepository.save(job);

        long applicantCount = applicationRepository.countByJobId(jobId);
        return EntityMapper.toJobResponse(job, applicantCount, null);
    }

    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public void deleteJob(Long jobId, Long recruiterUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        validateOwnership(job, recruiterUserId);

        if (job.getStatus() == JobStatus.PUBLISHED && applicationRepository.countByJobId(jobId) > 0) {
            throw new BadRequestException("Cannot delete published job that has existing candidate applications. Close the job instead.");
        }

        jobRepository.delete(job);
        auditLogService.record(recruiterUserId, null, "DELETE_JOB", "JOB", jobId.toString(),
                "Deleted job ID " + jobId, "127.0.0.1");
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id, Long currentUserId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        Boolean userEligible = null;
        if (currentUserId != null) {
            Student student = studentRepository.findByUserId(currentUserId).orElse(null);
            if (student != null) {
                boolean alreadyApplied = applicationRepository.existsByJobIdAndStudentId(job.getId(), student.getId());
                EvaluationContext context = EvaluationContext.builder()
                        .evaluationTime(LocalDateTime.now())
                        .alreadyApplied(alreadyApplied)
                        .build();
                EligibilityResult result = eligibilityEngine.evaluate(student, job, context);
                userEligible = result.isEligible();
            }
        }

        long applicantCount = applicationRepository.countByJobId(id);
        return EntityMapper.toJobResponse(job, applicantCount, userEligible);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(JobStatus status, Long companyId, String search, Long currentUserId, Pageable pageable) {
        Student student = currentUserId != null ? studentRepository.findByUserId(currentUserId).orElse(null) : null;

        return jobRepository.searchJobs(status, companyId, search, pageable)
                .map(job -> {
                    long count = applicationRepository.countByJobId(job.getId());
                    Boolean eligible = null;
                    if (student != null) {
                        boolean alreadyApplied = applicationRepository.existsByJobIdAndStudentId(job.getId(), student.getId());
                        EvaluationContext context = EvaluationContext.builder()
                                .evaluationTime(LocalDateTime.now())
                                .alreadyApplied(alreadyApplied)
                                .build();
                        eligible = eligibilityEngine.evaluate(student, job, context).isEligible();
                    }
                    return EntityMapper.toJobResponse(job, count, eligible);
                });
    }

    @Transactional(readOnly = true)
    public EligibilityResult checkStudentEligibility(Long jobId, Long studentUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ForbiddenException("Only registered students can check job eligibility"));

        boolean alreadyApplied = applicationRepository.existsByJobIdAndStudentId(jobId, student.getId());
        EvaluationContext context = EvaluationContext.builder()
                .evaluationTime(LocalDateTime.now())
                .alreadyApplied(alreadyApplied)
                .build();

        return eligibilityEngine.evaluate(student, job, context);
    }

    private void validateOwnership(Job job, Long recruiterUserId) {
        if (recruiterUserId == null) return;
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId).orElse(null);
        if (recruiter != null && !job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You can only manage job openings for your own organization");
        }
    }

    private void notifyEligibleStudents(Job job) {
        try {
            List<Student> students = studentRepository.findAll();
            for (Student student : students) {
                EvaluationContext context = EvaluationContext.builder()
                        .evaluationTime(LocalDateTime.now())
                        .alreadyApplied(false)
                        .build();
                EligibilityResult res = eligibilityEngine.evaluate(student, job, context);
                if (res.isEligible()) {
                    notificationService.createNotification(student.getUser(),
                            "New Eligible Job: " + job.getTitle(),
                            String.format("A new opening for %s at %s (%s) matches your profile and eligibility criteria.",
                                    job.getTitle(), job.getCompany().getName(), job.getSalaryPackage()),
                            "JOB_POSTED", job.getId());
                }
            }
        } catch (Exception ignored) {
            // Background notification failure should not rollback transaction
        }
    }
}
