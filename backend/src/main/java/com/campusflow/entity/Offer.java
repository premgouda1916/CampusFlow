package com.campusflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "job_designation", nullable = false, length = 150)
    private String jobDesignation;

    @Column(name = "salary_package", nullable = false, length = 100)
    private String salaryPackage;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "offer_expiration_date", nullable = false)
    private LocalDate offerExpirationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private OfferStatus status = OfferStatus.OFFERED;

    @Column(name = "offer_letter_url")
    private String offerLetterUrl;

    @Column(name = "issued_at", nullable = false)
    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;
}

