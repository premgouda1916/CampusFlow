package com.campusflow.repository;

import com.campusflow.entity.Offer;
import com.campusflow.entity.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByApplicationId(Long applicationId);

    @Query("SELECT o FROM Offer o WHERE o.application.student.id = :studentId")
    List<Offer> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT o FROM Offer o WHERE o.application.student.id = :studentId")
    Page<Offer> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT o FROM Offer o WHERE o.application.job.company.id = :companyId")
    Page<Offer> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    long countByStatus(OfferStatus status);

    @Query("SELECT COUNT(o) FROM Offer o WHERE o.application.job.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(o) FROM Offer o WHERE o.application.job.company.id = :companyId AND o.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") OfferStatus status);

    @Query("SELECT COUNT(o) FROM Offer o WHERE o.application.student.id = :studentId")
    long countByStudentId(@Param("studentId") Long studentId);
}

