package com.campusflow.service;

import com.campusflow.dto.response.RecruiterResponse;
import com.campusflow.entity.Recruiter;
import com.campusflow.entity.User;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.RecruiterRepository;
import com.campusflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public RecruiterResponse getProfileByUserId(Long userId) {
        Recruiter recruiter = recruiterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for user: " + userId));
        return EntityMapper.toRecruiterResponse(recruiter);
    }

    @Transactional(readOnly = true)
    public Page<RecruiterResponse> getRecruitersByApprovalStatus(boolean approved, Pageable pageable) {
        return recruiterRepository.findByApproved(approved, pageable)
                .map(EntityMapper::toRecruiterResponse);
    }

    @Transactional
    public RecruiterResponse approveRecruiter(Long recruiterId, boolean approved, Long actorUserId, String actorEmail) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + recruiterId));

        recruiter.setApproved(approved);
        User user = recruiter.getUser();
        user.setVerified(approved);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        recruiter = recruiterRepository.save(recruiter);

        auditLogService.record(actorUserId, actorEmail, approved ? "APPROVE_RECRUITER" : "REJECT_RECRUITER",
                "RECRUITER", recruiter.getId().toString(),
                (approved ? "Approved" : "Revoked") + " recruiter credentials for " + user.getFullName(), "127.0.0.1");

        notificationService.createNotification(user,
                approved ? "Recruiter Account Approved" : "Recruiter Access Revoked",
                approved ? "Your recruiter profile has been verified by the placement office. You may now publish campus job openings."
                         : "Your recruiter approval status was modified. Please consult placement administration.",
                "RECRUITER_STATUS", recruiter.getId());

        return EntityMapper.toRecruiterResponse(recruiter);
    }
}

