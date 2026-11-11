package com.campusflow.service;

import com.campusflow.dto.request.StudentProfileUpdateRequest;
import com.campusflow.dto.response.StudentResponse;
import com.campusflow.entity.Student;
import com.campusflow.entity.User;
import com.campusflow.exception.BadRequestException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.StudentRepository;
import com.campusflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Value("${campusflow.upload.dir:./uploads/resumes}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public StudentResponse getProfileByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));
        return EntityMapper.toStudentResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return EntityMapper.toStudentResponse(student);
    }

    @Transactional
    public StudentResponse updateProfile(Long userId, StudentProfileUpdateRequest req) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        User user = student.getUser();
        user.setFullName(req.getFullName().trim());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        if (req.getCollegeName() != null) student.setCollegeName(req.getCollegeName());
        if (req.getGraduationYear() != null) student.setGraduationYear(req.getGraduationYear());
        if (req.getCurrentCgpa() != null) student.setCurrentCgpa(req.getCurrentCgpa());
        if (req.getBacklogCount() != null) student.setBacklogCount(req.getBacklogCount());
        if (req.getSkills() != null) student.setSkills(req.getSkills());

        student = studentRepository.save(student);

        auditLogService.record(userId, user.getEmail(), "UPDATE_PROFILE", "STUDENT", student.getId().toString(),
                "Updated student profile", "127.0.0.1");

        return EntityMapper.toStudentResponse(student);
    }

    @Transactional
    public String uploadResume(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i + 1).toLowerCase();
        }

        if (!extension.matches("pdf|doc|docx")) {
            throw new BadRequestException("Only PDF, DOC, and DOCX files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 5MB limit");
        }

        try {
            Path targetDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetDir);

            String uniqueFileName = "resume_" + userId + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + extension;
            Path targetPath = targetDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String resumeUrl = "/uploads/resumes/" + uniqueFileName;

            Student student = studentRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            student.setResumeUrl(resumeUrl);
            studentRepository.save(student);

            auditLogService.record(userId, student.getUser().getEmail(), "UPLOAD_RESUME", "STUDENT",
                    student.getId().toString(), "Uploaded new resume: " + originalFilename, "127.0.0.1");

            return resumeUrl;
        } catch (IOException e) {
            throw new BadRequestException("Failed to store uploaded file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Long departmentId, Integer graduationYear, Boolean isPlaced, Pageable pageable) {
        return studentRepository.findStudentsWithFilter(departmentId, graduationYear, isPlaced, pageable)
                .map(EntityMapper::toStudentResponse);
    }
}
