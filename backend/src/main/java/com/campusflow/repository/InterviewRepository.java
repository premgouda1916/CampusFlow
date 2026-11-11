package com.campusflow.repository;

import com.campusflow.entity.Interview;
import com.campusflow.entity.InterviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplicationId(Long applicationId);

    @Query("SELECT i FROM Interview i WHERE i.application.student.id = :studentId ORDER BY i.scheduledAt ASC")
    List<Interview> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT i FROM Interview i WHERE i.application.student.id = :studentId ORDER BY i.scheduledAt ASC")
    Page<Interview> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT i FROM Interview i WHERE i.application.job.company.id = :companyId ORDER BY i.scheduledAt ASC")
    Page<Interview> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    long countByStatus(InterviewStatus status);

    @Query("SELECT COUNT(i) FROM Interview i WHERE i.application.job.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);
}

