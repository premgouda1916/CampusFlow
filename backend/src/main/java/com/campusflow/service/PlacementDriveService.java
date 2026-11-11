package com.campusflow.service;

import com.campusflow.dto.request.PlacementDriveRequest;
import com.campusflow.entity.DriveStatus;
import com.campusflow.entity.PlacementDrive;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.repository.PlacementDriveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public PlacementDrive createDrive(PlacementDriveRequest req, Long actorUserId, String actorEmail) {
        PlacementDrive drive = PlacementDrive.builder()
                .title(req.getTitle().trim())
                .academicYear(req.getAcademicYear().trim())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .status(req.getStatus() != null ? req.getStatus() : DriveStatus.UPCOMING)
                .description(req.getDescription())
                .build();
        drive = driveRepository.save(drive);

        auditLogService.record(actorUserId, actorEmail, "CREATE_DRIVE", "PLACEMENT_DRIVE",
                drive.getId().toString(), "Created placement drive: " + drive.getTitle(), "127.0.0.1");

        return drive;
    }

    @Transactional(readOnly = true)
    public List<PlacementDrive> getAllDrives() {
        return driveRepository.findAllByOrderByStartDateDesc();
    }

    @Transactional(readOnly = true)
    public PlacementDrive getDriveById(Long id) {
        return driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement drive not found with id: " + id));
    }

    @Transactional
    public PlacementDrive updateDrive(Long id, PlacementDriveRequest req, Long actorUserId, String actorEmail) {
        PlacementDrive drive = getDriveById(id);
        drive.setTitle(req.getTitle().trim());
        drive.setAcademicYear(req.getAcademicYear().trim());
        drive.setStartDate(req.getStartDate());
        drive.setEndDate(req.getEndDate());
        if (req.getStatus() != null) {
            drive.setStatus(req.getStatus());
        }
        drive.setDescription(req.getDescription());
        drive = driveRepository.save(drive);

        auditLogService.record(actorUserId, actorEmail, "UPDATE_DRIVE", "PLACEMENT_DRIVE",
                drive.getId().toString(), "Updated placement drive: " + drive.getTitle(), "127.0.0.1");

        return drive;
    }
}
