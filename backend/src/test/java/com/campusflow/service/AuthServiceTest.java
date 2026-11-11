package com.campusflow.service;

import com.campusflow.dto.request.LoginRequest;
import com.campusflow.dto.request.RegisterStudentRequest;
import com.campusflow.dto.response.AuthResponse;
import com.campusflow.entity.Department;
import com.campusflow.entity.Role;
import com.campusflow.entity.Student;
import com.campusflow.entity.User;
import com.campusflow.exception.DuplicateResourceException;
import com.campusflow.repository.*;
import com.campusflow.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private RecruiterRepository recruiterRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    private RegisterStudentRequest registerRequest;
    private Department department;
    private User savedUser;
    private Student savedStudent;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterStudentRequest.builder()
                .email("student@campusflow.com")
                .password("password123")
                .fullName("John Doe")
                .phone("9876543210")
                .usn("1TEST001")
                .departmentCode("CSE")
                .collegeName("Test College")
                .graduationYear(2027)
                .currentCgpa(BigDecimal.valueOf(8.50))
                .backlogCount(0)
                .skills("Java, React")
                .build();

        department = Department.builder().id(1L).code("CSE").name("Computer Science").build();
        savedUser = User.builder().id(1L).email("student@campusflow.com").fullName("John Doe").role(Role.STUDENT).active(true).verified(true).build();
        savedStudent = Student.builder().id(10L).user(savedUser).usn("1TEST001").department(department).build();
    }

    @Test
    @DisplayName("Successful student registration should hash password and issue JWT token")
    void testRegisterStudentSuccess() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(studentRepository.existsByUsn(any())).thenReturn(false);
        when(departmentRepository.findByCode("CSE")).thenReturn(Optional.of(department));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);
        when(jwtUtils.generateToken(any(), any(), any(), any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.registerStudent(registerRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("student@campusflow.com", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());
        verify(passwordEncoder).encode("password123");
        verify(auditLogService).record(any(), any(), eq("REGISTER_STUDENT"), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Student registration with existing email should throw DuplicateResourceException")
    void testRegisterStudentDuplicateEmail() {
        when(userRepository.existsByEmail("student@campusflow.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.registerStudent(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Student registration with existing USN should throw DuplicateResourceException")
    void testRegisterStudentDuplicateUsn() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(studentRepository.existsByUsn("1TEST001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.registerStudent(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Successful login should authenticate and issue JWT")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("student@campusflow.com", "password123");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail("student@campusflow.com")).thenReturn(Optional.of(savedUser));
        when(studentRepository.findByUserId(1L)).thenReturn(Optional.of(savedStudent));
        when(jwtUtils.generateToken(any(), any(), any(), any())).thenReturn("jwt.token.abc");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("jwt.token.abc", res.getToken());
        assertEquals("student@campusflow.com", res.getEmail());
    }
}

