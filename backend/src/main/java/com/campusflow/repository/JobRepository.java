package com.campusflow.repository;

import com.campusflow.entity.Job;
import com.campusflow.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByCompanyId(Long companyId, Pageable pageable);

    long countByCompanyId(Long companyId);

    long countByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND j.applicationDeadline > :now")
    List<Job> findActiveJobs(@Param("status") JobStatus status, @Param("now") LocalDateTime now);

    @Query("SELECT j FROM Job j WHERE (:status IS NULL OR j.status = :status) AND " +
           "(:companyId IS NULL OR j.company.id = :companyId) AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.company.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> searchJobs(@Param("status") JobStatus status,
                         @Param("companyId") Long companyId,
                         @Param("search") String search,
                         Pageable pageable);
}

