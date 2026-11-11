package com.campusflow.repository;

import com.campusflow.entity.Application;
import com.campusflow.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByJobIdAndStudentId(Long jobId, Long studentId);

    boolean existsByJobIdAndStudentId(Long jobId, Long studentId);

    Page<Application> findByStudentId(Long studentId, Pageable pageable);

    List<Application> findByStudentId(Long studentId);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    Page<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status, Pageable pageable);

    long countByJobId(Long jobId);

    long countByJobIdAndStatus(Long jobId, ApplicationStatus status);

    long countByStudentIdAndStatus(Long studentId, ApplicationStatus status);

    long countByStudentId(Long studentId);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId")
    Page<Application> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.company.id = :companyId AND (:status IS NULL OR a.status = :status)")
    Page<Application> findByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") ApplicationStatus status, Pageable pageable);
}

