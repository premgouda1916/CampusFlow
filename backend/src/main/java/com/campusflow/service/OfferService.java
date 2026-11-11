package com.campusflow.service;

import com.campusflow.dto.request.OfferCreateRequest;
import com.campusflow.dto.request.OfferResponseRequest;
import com.campusflow.dto.response.OfferResponse;
import com.campusflow.entity.*;
import com.campusflow.exception.BadRequestException;
import com.campusflow.exception.DuplicateResourceException;
import com.campusflow.exception.ForbiddenException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public OfferResponse createOffer(Long applicationId, OfferCreateRequest req, Long recruiterUserId) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only authorized recruiters can extend employment offers"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You cannot issue offers on behalf of another enterprise");
        }

        if (offerRepository.findByApplicationId(applicationId).isPresent()) {
            throw new DuplicateResourceException("An offer letter has already been extended for this candidate application");
        }

        Offer offer = Offer.builder()
                .application(application)
                .jobDesignation(req.getJobDesignation().trim())
                .salaryPackage(req.getSalaryPackage().trim())
                .joiningDate(req.getJoiningDate())
                .offerExpirationDate(req.getOfferExpirationDate())
                .status(OfferStatus.OFFERED)
                .offerLetterUrl(req.getOfferLetterUrl())
                .issuedAt(LocalDateTime.now())
                .build();
        offer = offerRepository.save(offer);

        // Mark application as SELECTED
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(ApplicationStatus.SELECTED);
        applicationRepository.save(application);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(oldStatus)
                .toStatus(ApplicationStatus.SELECTED)
                .changedBy(recruiter.getUser())
                .comment("Recruiter extended formal offer for " + req.getJobDesignation() + " (" + req.getSalaryPackage() + ")")
                .changedAt(LocalDateTime.now())
                .build();
        statusHistoryRepository.save(history);

        // Send celebration notification to student
        notificationService.createNotification(application.getStudent().getUser(),
                "Congratulations! Job Offer Received!",
                String.format("%s has extended an offer for the role of %s with a package of %s. Please review and respond by %s.",
                        recruiter.getCompany().getName(), req.getJobDesignation(), req.getSalaryPackage(), req.getOfferExpirationDate()),
                "OFFER_ISSUED", offer.getId());

        auditLogService.record(recruiterUserId, recruiter.getUser().getEmail(), "CREATE_OFFER",
                "OFFER", offer.getId().toString(),
                "Issued offer to " + application.getStudent().getUser().getFullName() + " for " + req.getJobDesignation(), "127.0.0.1");

        return EntityMapper.toOfferResponse(offer);
    }

    @Transactional
    public OfferResponse respondToOffer(Long offerId, OfferResponseRequest req, Long studentUserId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + offerId));

        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ForbiddenException("Invalid student account"));

        if (!offer.getApplication().getStudent().getId().equals(student.getId())) {
            throw new ForbiddenException("You cannot accept or reject an offer addressed to another student");
        }

        if (offer.getStatus() != OfferStatus.OFFERED) {
            throw new BadRequestException("This offer has already been resolved (Status: " + offer.getStatus() + ")");
        }

        if (offer.getOfferExpirationDate() != null && LocalDate.now().isAfter(offer.getOfferExpirationDate())) {
            offer.setStatus(OfferStatus.EXPIRED);
            offerRepository.save(offer);
            throw new BadRequestException("This employment offer expired on " + offer.getOfferExpirationDate());
        }

        boolean accepted = "ACCEPT".equalsIgnoreCase(req.getAction());
        offer.setStatus(accepted ? OfferStatus.ACCEPTED : OfferStatus.REJECTED);
        offer.setRespondedAt(LocalDateTime.now());
        offer = offerRepository.save(offer);

        if (accepted) {
            student.setPlaced(true);
            studentRepository.save(student);
        }

        // Notify recruiter
        Recruiter recruiter = offer.getApplication().getJob().getCreatedByRecruiter();
        if (recruiter != null) {
            notificationService.createNotification(recruiter.getUser(),
                    "Candidate Offer Response: " + (accepted ? "Accepted" : "Declined"),
                    String.format("Candidate %s has %s the offer for %s (%s).",
                            student.getUser().getFullName(), accepted ? "accepted" : "declined",
                            offer.getJobDesignation(), offer.getSalaryPackage()),
                    "OFFER_RESPONSE", offer.getId());
        }

        auditLogService.record(studentUserId, student.getUser().getEmail(), accepted ? "ACCEPT_OFFER" : "REJECT_OFFER",
                "OFFER", offer.getId().toString(),
                (accepted ? "Accepted" : "Declined") + " offer for " + offer.getJobDesignation() + " at " + offer.getApplication().getJob().getCompany().getName(), "127.0.0.1");

        return EntityMapper.toOfferResponse(offer);
    }

    @Transactional(readOnly = true)
    public Page<OfferResponse> getMyOffers(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return offerRepository.findByStudentId(student.getId(), pageable)
                .map(EntityMapper::toOfferResponse);
    }

    @Transactional(readOnly = true)
    public Page<OfferResponse> getCompanyOffers(Long recruiterUserId, Pageable pageable) {
        Recruiter recruiter = recruiterRepository.findByUserId(recruiterUserId)
                .orElseThrow(() -> new ForbiddenException("Only recruiters can access company offers"));
        return offerRepository.findByCompanyId(recruiter.getCompany().getId(), pageable)
                .map(EntityMapper::toOfferResponse);
    }
}

