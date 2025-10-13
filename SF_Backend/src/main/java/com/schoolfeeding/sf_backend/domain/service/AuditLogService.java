package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.AuditLog;
import com.schoolfeeding.sf_backend.domain.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Creates a new log entry. The constructor of AuditLog handles mapping the 'action' argument 
     * to the 'activityAction' field.
     */
    public void createLog(String action, String actor, String severity, String details) {
        AuditLog log = new AuditLog(action, actor, severity, details);
        auditLogRepository.save(log);
    }

    /**
     * Lists logs based on time range, severity, and search term (activityAction).
     */
    public Page<AuditLog> listLogs(LocalDateTime startDate, LocalDateTime endDate, String severity, String search, Pageable pageable) {
        // CORRECTED: Calling the repository method with the correct property name
        return auditLogRepository.findByTimestampBetweenAndSeverityContainingIgnoreCaseAndActivityActionContainingIgnoreCase(
                startDate, endDate, severity, search, pageable
        );
    }

    /**
     * Exports logs (simple implementation using stream filtering).
     */
    public List<AuditLog> exportLogs(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findAll().stream()
                .filter(log -> log.getTimestamp().isAfter(startDate) && log.getTimestamp().isBefore(endDate))
                .collect(Collectors.toList());
    }
}