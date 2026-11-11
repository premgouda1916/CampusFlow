package com.campusflow.repository;

import com.campusflow.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);

    List<AuditLog> findTop20ByOrderByTimestampDesc();

    Page<AuditLog> findByEntityType(String entityType, Pageable pageable);

    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
}

