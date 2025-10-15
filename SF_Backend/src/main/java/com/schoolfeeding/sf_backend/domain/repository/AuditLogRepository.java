package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    
    Page<AuditLog> findByTimestampBetweenAndSeverityContainingIgnoreCaseAndActivityActionContainingIgnoreCase(
             LocalDateTime startDate,
             LocalDateTime endDate,
             String severity,
             String search, 
             Pageable pageable
    );
}