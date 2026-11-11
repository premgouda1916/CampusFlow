package com.campusflow.service;

import com.campusflow.dto.request.ApplicationStatusUpdateRequest;
import com.campusflow.dto.request.ApplicationSubmitRequest;
import com.campusflow.dto.response.ApplicationHistoryResponse;
import com.campusflow.dto.response.ApplicationResponse;
import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.entity.*;
import com.campusflow.exception.*;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.*;
import com.campusflow.service.eligibility.EligibilityEngine;
import com.campusflow.service.eligibility.EvaluationContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final EligibilityEngine eligibilityEngine;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public ApplicationResponse applyForJob(Long jobId, Long studentUserId, ApplicationSubmitRequest req) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ForbiddenException("Only registered students can apply for campus placements"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with id: " + jobId));

        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new BadRequestException("This job vacancy is not currently accepting applications (Status: " + job.getStatus() + ")");
        }

        if (applicationRepository.existsByJobIdAndStudentId(jobId, student.getId())) {
            throw new DuplicateResourceException("You have already submitted an application for this position");
        }

        EvaluationContext context = EvaluationContext.builder()
                .evaluationTime(LocalDateTime.now())
                .alreadyApplied(false)
                .build();

        EligibilityResult eligibility = eligibilityEngine.evaluate(student, job, context);
        if (!eligibility.isEligible()) {
            String primaryReason = eligibility.getRejectionReasons().isEmpty()
                    ? "Academic or profile requirements not fulfilled"
                    : eligibility.getRejectionReasons().get(0);
            throw new IneligibleApplicationException("Application rejected: " + primaryReason, eligibility);
        }

        Application application = Application.builder()
                .job(job)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .notes(req != null ? req.getNotes() : null)
                .build();
        application = applicationRepository.save(application);

        // Record history
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(null)
                .toStatus(ApplicationStatus.APPLIED)
                .changedBy(student.getUser())
                .comment("Candidate submitted initial application")
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        // Notify student
        notificationService.createNotification(student.getUser(),
                "Application Submitted: " + job.getTitle(),
                String.format("Your application for %s at %s has been received.", job.getTitle(), job.getCompany().getName()),
                "APPLICATION_STATUS", application.getId());

        // Notify recruiter
        if (job.getCreatedByRecruiter() != null) {
            notificationService.createNotification(job.getCreatedByRecruiter().getUser(),
                    "New Application: " + student.getUser().getFullName(),
                    String.format("Candidate %s (%s, CGPA: %.2f) applied for %s.",
                            student.getUser().getFullName(), student.getDepartment().getCode(), student.getCurrentCgpa(), job.getTitle()),
                    "APPLICATION_STATUS", application.getId());
        }

        auditLogService.record(studentUserId, student.getUser().getEmail(), "SUBMIT_APPLICATION",
                "APPLICATION", application.getId().toString(),
                "Applied to job: " + job.getTitle() + " at " + job.getCompany().getName(), "127.0.0.1");

        return EntityMapper.toApplicationResponse(application);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getMyApplications(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return applicationRepository.findByStudentId(student.getId(), pageable)
                .map(EntityMapper::toApplicationResponse);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getJobApplications(Long jobId, ApplicationStatus status, Long currentUserId, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // If recruiter, check ownership
        Recruiter recruiter = recruiterRepository.findByUserId(currentUserId).orElse(null);
        if (recruiter != null && !job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You can only view applicants for your company's positions");
        }

        if (status != null) {
            return applicationRepository.findByJobIdAndStatus(jobId, status, pageable)
                    .map(EntityMapper::toApplicationResponse);
        }
        return applicationRepository.findByJobId(jobId, pageable)
                .map(EntityMapper::toApplicationResponse);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getCompanyApplications(Long recruiterUserId, ApplicationStatus status, Pageable pageable) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only recruiters can access company applicant lists"));

        return applicationRepository.findByCompanyIdAndStatus(recruiter.getCompany().getId(), status, pageable)
                .map(EntityMapper::toApplicationResponse);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long applicationId, Long currentUserId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        return EntityMapper.toApplicationResponse(application);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatusUpdateRequest req, Long actorUserId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // If recruiter, check company ownership
        Recruiter recruiter = recruiterRepository.findByUserId(actorUserId).orElse(null);
        if (recruiter != null && !application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("Cannot update applicant status belonging to another company");
        }

        ApplicationStatus oldStatus = application.getStatus();
        ApplicationStatus newStatus = req.getStatus();

        application.setStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now());
        application = applicationRepository.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(oldStatus)
                .toStatus(newStatus)
                .changedBy(actor)
                .comment(req.getComment())
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        // Notify candidate
        notificationService.createNotification(application.getStudent().getUser(),
                "Application Status Update: " + newStatus,
                String.format("Your application for %s has been updated to %s. %s",
                        application.getJob().getTitle(), newStatus,
                        req.getComment() != null ? "Note: " + req.getComment() : ""),
                "APPLICATION_STATUS", application.getId());

        auditLogService.record(actorUserId, actor.getEmail(), "UPDATE_APPLICATION_STATUS",
                "APPLICATION", application.getId().toString(),
                String.format("Updated application #%d status from %s to %s", applicationId, oldStatus, newStatus), "127.0.0.1");

        return EntityMapper.toApplicationResponse(application);
    }

    @Transactional
    public void withdrawApplication(Long applicationId, Long studentUserId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ForbiddenException("Invalid student account"));

        if (!application.getStudent().getId().equals(student.getId())) {
            throw new ForbiddenException("You cannot withdraw another candidate's application");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED) {
            throw new BadRequestException("Cannot withdraw an application that has already been selected for an offer");
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(oldStatus)
                .toStatus(ApplicationStatus.WITHDRAWN)
                .changedBy(student.getUser())
                .comment("Candidate voluntarily withdrew application")
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<ApplicationHistoryResponse> getApplicationHistory(Long applicationId) {
        return statusHistoryRepository.findByApplicationIdOrderByChangedAtDesc(applicationId)
                .stream()
                .map(EntityMapper::toApplicationHistoryResponse)
                .toList();
    }
}

