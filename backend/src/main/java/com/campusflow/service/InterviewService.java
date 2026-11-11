package com.campusflow.service;

import com.campusflow.dto.request.InterviewFeedbackRequest;
import com.campusflow.dto.request.InterviewScheduleRequest;
import com.campusflow.dto.response.InterviewResponse;
import com.campusflow.entity.*;
import com.campusflow.exception.ForbiddenException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final RecruiterRepository recruiterRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm");

    @Transactional
    public InterviewResponse scheduleInterview(Long applicationId, InterviewScheduleRequest req, Long recruiterUserId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only authorized recruiters can schedule interviews"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You cannot schedule interviews for other companies");
        }

        Interview interview = Interview.builder()
                .application(application)
                .conductedBy(recruiter)
                .roundName(req.getRoundName())
                .scheduledAt(req.getScheduledAt())
                .mode(req.getMode())
                .locationOrLink(req.getLocationOrLink())
                .instructions(req.getInstructions())
                .status(InterviewStatus.SCHEDULED)
                .build();
        interview = interviewRepository.save(interview);

        // Update application state
        if (application.getStatus() != ApplicationStatus.INTERVIEW_SCHEDULED) {
            ApplicationStatus old = application.getStatus();
            application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
            applicationRepository.save(application);

            ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                    .application(application)
                    .fromStatus(old)
                    .toStatus(ApplicationStatus.INTERVIEW_SCHEDULED)
                    .changedBy(recruiter.getUser())
                    .comment("Scheduled " + req.getRoundName() + " for " + req.getScheduledAt().format(FORMATTER))
                    .changedAt(LocalDateTime.now())
                    .build();
            statusHistoryRepository.save(history);
        }

        // Notify candidate
        notificationService.createNotification(application.getStudent().getUser(),
                "Interview Scheduled: " + req.getRoundName(),
                String.format("Your interview for %s at %s is set for %s (%s). Location/Link: %s",
                        application.getJob().getTitle(), recruiter.getCompany().getName(),
                        req.getScheduledAt().format(FORMATTER), req.getMode(), req.getLocationOrLink()),
                "INTERVIEW_SCHEDULED", interview.getId());

        auditLogService.record(recruiterUserId, recruiter.getUser().getEmail(), "SCHEDULE_INTERVIEW",
                "INTERVIEW", interview.getId().toString(),
                "Scheduled " + req.getRoundName() + " with student " + application.getStudent().getUser().getFullName(), "127.0.0.1");

        return EntityMapper.toInterviewResponse(interview);
    }

    @Transactional
    public InterviewResponse updateFeedback(Long interviewId, InterviewFeedbackRequest req, Long recruiterUserId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + interviewId));

        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId).orElse(null);
        if (recruiter != null && !interview.getApplication().getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You cannot evaluate interviews for other companies");
        }

        interview.setStatus(req.getStatus());
        if (req.getFeedback() != null) {
            interview.setFeedback(req.getFeedback());
        }
        interview = interviewRepository.save(interview);

        return EntityMapper.toInterviewResponse(interview);
    }

    @Transactional(readOnly = true)
    public Page<InterviewResponse> getMyInterviews(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return interviewRepository.findByStudentId(student.getId(), pageable)
                .map(EntityMapper::toInterviewResponse);
    }

    @Transactional(readOnly = true)
    public Page<InterviewResponse> getCompanyInterviews(Long recruiterUserId, Pageable pageable) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only recruiters can view company interviews"));
        return interviewRepository.findByCompanyId(recruiter.getCompany().getId(), pageable)
                .map(EntityMapper::toInterviewResponse);
    }
}

