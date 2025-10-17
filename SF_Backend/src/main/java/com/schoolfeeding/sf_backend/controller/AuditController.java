package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.AuditLog;
import com.schoolfeeding.sf_backend.domain.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditLogService auditLogService;

    public AuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> listLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false, defaultValue = "") String severity,
            @RequestParam(required = false, defaultValue = "") String search,
            @PageableDefault(size = 20, sort = "timestamp") Pageable pageable) {

        LocalDateTime start = startDate != null ? startDate : LocalDateTime.MIN;
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now().plus(1, ChronoUnit.DAYS);

        Page<AuditLog> logs = auditLogService.listLogs(start, end, severity, search, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/export")
    public ResponseEntity<List<AuditLog>> exportLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<AuditLog> logs = auditLogService.exportLogs(startDate, endDate);
        return ResponseEntity.ok(logs);
    }
}
