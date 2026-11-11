package com.campusflow.service;

import com.campusflow.dto.request.LoginRequest;
import com.campusflow.dto.request.PasswordResetRequest;
import com.campusflow.dto.request.RegisterRecruiterRequest;
import com.campusflow.dto.request.RegisterStudentRequest;
import com.campusflow.dto.response.AuthResponse;
import com.campusflow.entity.*;
import com.campusflow.exception.BadRequestException;
import com.campusflow.exception.DuplicateResourceException;
import com.campusflow.exception.ForbiddenException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.repository.*;
import com.campusflow.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse registerStudent(RegisterStudentRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("An account with email " + req.getEmail() + " already exists");
        }
        if (studentRepository.existsByUsn(req.getUsn())) {
            throw new DuplicateResourceException("A student with USN " + req.getUsn() + " already exists");
        }

        Department department = departmentRepository.findByCode(req.getDepartmentCode().toUpperCase())
                .orElseGet(() -> departmentRepository.save(Department.builder()
                        .code(req.getDepartmentCode().toUpperCase())
                        .name(req.getDepartmentCode().toUpperCase() + " Department")
                        .active(true)
                        .build()));

        User user = User.builder()
                .email(req.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone())
                .role(Role.STUDENT)
                .active(true)
                .verified(true)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .usn(req.getUsn().toUpperCase().trim())
                .department(department)
                .collegeName(req.getCollegeName().trim())
                .graduationYear(req.getGraduationYear())
                .currentCgpa(req.getCurrentCgpa())
                .backlogCount(req.getBacklogCount())
                .skills(req.getSkills())
                .placed(false)
                .build();
        student = studentRepository.save(student);

        auditLogService.record(user.getId(), user.getEmail(), "REGISTER_STUDENT", "USER", user.getId().toString(),
                "Registered new student " + user.getFullName(), "127.0.0.1");

        notificationService.createNotification(user, "Welcome to CampusFlow!",
                "Your student account is active. Explore verified campus placement opportunities and build your profile.",
                "SYSTEM", student.getId());

        Map<String, Object> claims = new HashMap<>();
        claims.put("profileId", student.getId());
        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name(), claims);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .verified(user.isVerified())
                .profileId(student.getId())
                .build();
    }

    @Transactional
    public AuthResponse registerRecruiter(RegisterRecruiterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("An account with email " + req.getEmail() + " already exists");
        }

        Company company = companyRepository.findByName(req.getCompanyName().trim())
                .orElseGet(() -> companyRepository.save(Company.builder()
                        .name(req.getCompanyName().trim())
                        .website(req.getCompanyWebsite())
                        .industry(req.getIndustry())
                        .location(req.getLocation())
                        .verified(false) // Requires placement officer approval
                        .build()));

        User user = User.builder()
                .email(req.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone())
                .role(Role.RECRUITER)
                .active(true)
                .verified(false) // Recruiter requires verification before job publishing
                .build();
        user = userRepository.save(user);

        Recruiter recruiter = Recruiter.builder()
                .user(user)
                .company(company)
                .designation(req.getDesignation())
                .approved(false)
                .build();
        recruiter = recruiterRepository.save(recruiter);

        auditLogService.record(user.getId(), user.getEmail(), "REGISTER_RECRUITER", "USER", user.getId().toString(),
                "Registered new recruiter " + user.getFullName() + " for company " + company.getName(), "127.0.0.1");

        Map<String, Object> claims = new HashMap<>();
        claims.put("profileId", recruiter.getId());
        claims.put("companyId", company.getId());
        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name(), claims);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .verified(false)
                .profileId(recruiter.getId())
                .companyId(company.getId())
                .companyName(company.getName())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase().trim(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + req.getEmail()));

        if (!user.isActive()) {
            throw new ForbiddenException("Account has been deactivated. Please contact campus administration.");
        }

        Long profileId = null;
        Long companyId = null;
        String companyName = null;

        Map<String, Object> claims = new HashMap<>();
        if (user.getRole() == Role.STUDENT) {
            Student student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student != null) {
                profileId = student.getId();
                claims.put("profileId", profileId);
            }
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElse(null);
            if (recruiter != null) {
                profileId = recruiter.getId();
                companyId = recruiter.getCompany().getId();
                companyName = recruiter.getCompany().getName();
                claims.put("profileId", profileId);
                claims.put("companyId", companyId);
            }
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name(), claims);

        auditLogService.record(user.getId(), user.getEmail(), "LOGIN", "USER", user.getId().toString(),
                "User logged in successfully", "127.0.0.1");

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .verified(user.isVerified())
                .profileId(profileId)
                .companyId(companyId)
                .companyName(companyName)
                .build();
    }

    @Transactional
    public void resetPassword(PasswordResetRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("No account found registered under email: " + req.getEmail()));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        auditLogService.record(user.getId(), user.getEmail(), "PASSWORD_RESET", "USER", user.getId().toString(),
                "Password updated successfully", "127.0.0.1");
    }
}
