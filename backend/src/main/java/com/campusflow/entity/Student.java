package com.campusflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String usn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "college_name", nullable = false, length = 150)
    private String collegeName;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(name = "current_cgpa", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal currentCgpa = BigDecimal.ZERO;

    @Column(name = "backlog_count", nullable = false)
    @Builder.Default
    private Integer backlogCount = 0;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "is_placed", nullable = false)
    @Builder.Default
    private boolean placed = false;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;
}
