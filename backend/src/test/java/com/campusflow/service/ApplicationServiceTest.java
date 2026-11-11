package com.campusflow.service;

import com.campusflow.dto.request.ApplicationStatusUpdateRequest;
import com.campusflow.dto.request.ApplicationSubmitRequest;
import com.campusflow.dto.response.ApplicationResponse;
import com.campusflow.dto.response.EligibilityResult;
import com.campusflow.entity.*;
import com.campusflow.exception.DuplicateResourceException;
import com.campusflow.exception.IneligibleApplicationException;
import com.campusflow.repository.*;
import com.campusflow.service.eligibility.EligibilityEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private RecruiterRepository recruiterRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EligibilityEngine eligibilityEngine;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private ApplicationService applicationService;

    private Student student;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        User studentUser = User.builder().id(100L).email("student@test.com").fullName("Test Student").role(Role.STUDENT).build();
        Department dept = Department.builder().id(1L).code("CSE").name("Computer Science").build();
        student = Student.builder().id(10L).user(studentUser).usn("1TEST001").department(dept).currentCgpa(BigDecimal.valueOf(8.5)).backlogCount(0).graduationYear(2027).build();

        Company company = Company.builder().id(20L).name("Tech Corp").verified(true).build();
        User recruiterUser = User.builder().id(200L).email("recruiter@test.com").fullName("Test Recruiter").role(Role.RECRUITER).build();
        Recruiter recruiter = Recruiter.builder().id(2L).user(recruiterUser).company(company).approved(true).build();

        job = Job.builder()
                .id(50L)
                .title("Software Engineer")
                .company(company)
                .createdByRecruiter(recruiter)
                .status(JobStatus.PUBLISHED)
                .applicationDeadline(LocalDateTime.now().plusDays(10))
                .salaryPackage("15 LPA")
                .location("Bangalore")
                .minCgpa(BigDecimal.valueOf(7.0))
                .maxBacklogs(0)
                .eligibleDepartments("CSE")
                .graduationYear(2027)
                .build();

        application = Application.builder()
                .id(1L)
                .job(job)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Eligible student applying for published job should succeed")
    void testApplySuccess() {
        when(studentRepository.findByUserId(100L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobIdAndStudentId(50L, 10L)).thenReturn(false);

        EligibilityResult eligible = EligibilityResult.builder().eligible(true).build();
        when(eligibilityEngine.evaluate(any(), any(), any())).thenReturn(eligible);
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        ApplicationResponse response = applicationService.applyForJob(50L, 100L, new ApplicationSubmitRequest("Cover note"));

        assertNotNull(response);
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        verify(applicationRepository).save(any(Application.class));
        verify(statusHistoryRepository).save(any());
        verify(notificationService, atLeastOnce()).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Applying twice to the same job should throw DuplicateResourceException")
    void testApplyDuplicate() {
        when(studentRepository.findByUserId(100L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobIdAndStudentId(50L, 10L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> applicationService.applyForJob(50L, 100L, null));
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ineligible student applying should throw IneligibleApplicationException")
    void testApplyIneligible() {
        when(studentRepository.findByUserId(100L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByJobIdAndStudentId(50L, 10L)).thenReturn(false);

        EligibilityResult ineligible = EligibilityResult.builder()
                .eligible(false)
                .rejectionReasons(List.of("CGPA below required cutoff"))
                .build();
        when(eligibilityEngine.evaluate(any(), any(), any())).thenReturn(ineligible);

        assertThrows(IneligibleApplicationException.class, () -> applicationService.applyForJob(50L, 100L, null));
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Recruiter updating application status should record audit and transition status")
    void testUpdateStatus() {
        User recruiterUser = User.builder().id(200L).email("recruiter@test.com").fullName("Test Recruiter").role(Role.RECRUITER).build();
        Recruiter recruiter = Recruiter.builder().id(2L).user(recruiterUser).company(job.getCompany()).approved(true).build();

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(userRepository.findById(200L)).thenReturn(Optional.of(recruiterUser));
        when(recruiterRepository.findByUserId(200L)).thenReturn(Optional.of(recruiter));
        when(applicationRepository.save(any())).thenReturn(application);

        ApplicationStatusUpdateRequest req = new ApplicationStatusUpdateRequest(ApplicationStatus.SHORTLISTED, "Strong resume");
        ApplicationResponse updated = applicationService.updateStatus(1L, req, 200L);

        assertNotNull(updated);
        verify(statusHistoryRepository).save(any());
        verify(notificationService).createNotification(eq(student.getUser()), any(), any(), any(), any());
    }
}

