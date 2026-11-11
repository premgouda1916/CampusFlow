package com.campusflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placement_drive_id")
    private PlacementDrive placementDrive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_recruiter_id", nullable = false)
    private Recruiter createdByRecruiter;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "job_type", nullable = false, length = 50)
    private String jobType;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "salary_package", nullable = false, length = 50)
    private String salaryPackage;

    @Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal minCgpa = BigDecimal.ZERO;

    @Column(name = "max_backlogs", nullable = false)
    @Builder.Default
    private Integer maxBacklogs = 0;

    @Column(name = "eligible_departments", nullable = false)
    private String eligibleDepartments;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "application_deadline", nullable = false)
    private LocalDateTime applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;
}

