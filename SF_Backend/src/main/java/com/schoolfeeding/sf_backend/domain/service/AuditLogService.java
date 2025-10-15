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

    
    public void createLog(String action, String actor, String severity, String details) {
        AuditLog log = new AuditLog(action, actor, severity, details);
        auditLogRepository.save(log);
    }

    
    public Page<AuditLog> listLogs(LocalDateTime startDate, LocalDateTime endDate, String severity, String search, Pageable pageable) {
        
        return auditLogRepository.findByTimestampBetweenAndSeverityContainingIgnoreCaseAndActivityActionContainingIgnoreCase(
                startDate, endDate, severity, search, pageable
        );
    }

    
    public List<AuditLog> exportLogs(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findAll().stream()
                .filter(log -> log.getTimestamp().isAfter(startDate) && log.getTimestamp().isBefore(endDate))
                .collect(Collectors.toList());
    }
}