package com.campusflow.mapper;

import com.campusflow.dto.response.*;
import com.campusflow.entity.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public final class EntityMapper {

    private EntityMapper() {}

    public static UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static StudentResponse toStudentResponse(Student student) {
        if (student == null) return null;
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .email(student.getUser().getEmail())
                .fullName(student.getUser().getFullName())
                .phone(student.getUser().getPhone())
                .usn(student.getUsn())
                .departmentId(student.getDepartment().getId())
                .departmentCode(student.getDepartment().getCode())
                .departmentName(student.getDepartment().getName())
                .collegeName(student.getCollegeName())
                .graduationYear(student.getGraduationYear())
                .currentCgpa(student.getCurrentCgpa())
                .backlogCount(student.getBacklogCount())
                .skills(student.getSkills())
                .resumeUrl(student.getResumeUrl())
                .profilePhotoUrl(student.getProfilePhotoUrl())
                .placed(student.isPlaced())
                .build();
    }

    public static CompanyResponse toCompanyResponse(Company company, long activeJobs) {
        if (company == null) return null;
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .industry(company.getIndustry())
                .location(company.getLocation())
                .description(company.getDescription())
                .verified(company.isVerified())
                .createdAt(company.getCreatedAt())
                .activeJobsCount(activeJobs)
                .build();
    }

    public static RecruiterResponse toRecruiterResponse(Recruiter recruiter) {
        if (recruiter == null) return null;
        return RecruiterResponse.builder()
                .id(recruiter.getId())
                .userId(recruiter.getUser().getId())
                .email(recruiter.getUser().getEmail())
                .fullName(recruiter.getUser().getFullName())
                .phone(recruiter.getUser().getPhone())
                .companyId(recruiter.getCompany().getId())
                .companyName(recruiter.getCompany().getName())
                .designation(recruiter.getDesignation())
                .approved(recruiter.isApproved())
                .build();
    }

    public static JobResponse toJobResponse(Job job, long applicantCount, Boolean userEligible) {
        if (job == null) return null;
        boolean isExpired = job.getApplicationDeadline() != null && LocalDateTime.now().isAfter(job.getApplicationDeadline());
        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .companyWebsite(job.getCompany().getWebsite())
                .placementDriveId(job.getPlacementDrive() != null ? job.getPlacementDrive().getId() : null)
                .placementDriveTitle(job.getPlacementDrive() != null ? job.getPlacementDrive().getTitle() : null)
                .recruiterId(job.getCreatedByRecruiter() != null ? job.getCreatedByRecruiter().getId() : null)
                .recruiterName(job.getCreatedByRecruiter() != null ? job.getCreatedByRecruiter().getUser().getFullName() : null)
                .title(job.getTitle())
                .description(job.getDescription())
                .jobType(job.getJobType())
                .location(job.getLocation())
                .salaryPackage(job.getSalaryPackage())
                .minCgpa(job.getMinCgpa())
                .maxBacklogs(job.getMaxBacklogs())
                .eligibleDepartments(job.getEligibleDepartments())
                .graduationYear(job.getGraduationYear())
                .requiredSkills(job.getRequiredSkills())
                .applicationDeadline(job.getApplicationDeadline())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .totalApplicants(applicantCount)
                .isExpired(isExpired)
                .userEligible(userEligible)
                .build();
    }

    public static ApplicationResponse toApplicationResponse(Application app) {
        if (app == null) return null;
        return ApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyId(app.getJob().getCompany().getId())
                .companyName(app.getJob().getCompany().getName())
                .salaryPackage(app.getJob().getSalaryPackage())
                .location(app.getJob().getLocation())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getUser().getFullName())
                .studentEmail(app.getStudent().getUser().getEmail())
                .studentPhone(app.getStudent().getUser().getPhone())
                .studentUsn(app.getStudent().getUsn())
                .studentDepartment(app.getStudent().getDepartment().getName())
                .studentCgpa(app.getStudent().getCurrentCgpa())
                .studentBacklogs(app.getStudent().getBacklogCount())
                .studentResumeUrl(app.getStudent().getResumeUrl())
                .studentSkills(app.getStudent().getSkills())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .reviewedAt(app.getReviewedAt())
                .notes(app.getNotes())
                .build();
    }

    public static ApplicationHistoryResponse toApplicationHistoryResponse(ApplicationStatusHistory history) {
        if (history == null) return null;
        return ApplicationHistoryResponse.builder()
                .id(history.getId())
                .applicationId(history.getApplication().getId())
                .fromStatus(history.getFromStatus())
                .toStatus(history.getToStatus())
                .changedByUserId(history.getChangedBy().getId())
                .changedByUserName(history.getChangedBy().getFullName())
                .comment(history.getComment())
                .changedAt(history.getChangedAt())
                .build();
    }

    public static InterviewResponse toInterviewResponse(Interview interview) {
        if (interview == null) return null;
        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .jobId(interview.getApplication().getJob().getId())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .companyId(interview.getApplication().getJob().getCompany().getId())
                .companyName(interview.getApplication().getJob().getCompany().getName())
                .studentId(interview.getApplication().getStudent().getId())
                .studentName(interview.getApplication().getStudent().getUser().getFullName())
                .studentUsn(interview.getApplication().getStudent().getUsn())
                .recruiterId(interview.getConductedBy().getId())
                .recruiterName(interview.getConductedBy().getUser().getFullName())
                .roundName(interview.getRoundName())
                .scheduledAt(interview.getScheduledAt())
                .mode(interview.getMode())
                .locationOrLink(interview.getLocationOrLink())
                .instructions(interview.getInstructions())
                .status(interview.getStatus())
                .feedback(interview.getFeedback())
                .build();
    }

    public static OfferResponse toOfferResponse(Offer offer) {
        if (offer == null) return null;
        boolean isExpired = offer.getOfferExpirationDate() != null && LocalDate.now().isAfter(offer.getOfferExpirationDate());
        return OfferResponse.builder()
                .id(offer.getId())
                .applicationId(offer.getApplication().getId())
                .jobId(offer.getApplication().getJob().getId())
                .jobTitle(offer.getApplication().getJob().getTitle())
                .companyId(offer.getApplication().getJob().getCompany().getId())
                .companyName(offer.getApplication().getJob().getCompany().getName())
                .studentId(offer.getApplication().getStudent().getId())
                .studentName(offer.getApplication().getStudent().getUser().getFullName())
                .studentEmail(offer.getApplication().getStudent().getUser().getEmail())
                .studentUsn(offer.getApplication().getStudent().getUsn())
                .jobDesignation(offer.getJobDesignation())
                .salaryPackage(offer.getSalaryPackage())
                .joiningDate(offer.getJoiningDate())
                .offerExpirationDate(offer.getOfferExpirationDate())
                .status(offer.getStatus())
                .offerLetterUrl(offer.getOfferLetterUrl())
                .issuedAt(offer.getIssuedAt())
                .respondedAt(offer.getRespondedAt())
                .isExpired(isExpired)
                .build();
    }

    public static NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public static AuditLogResponse toAuditLogResponse(AuditLog log) {
        if (log == null) return null;
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}

