package com.schoolfeeding.sf_backend.controller.admin;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.service.admin.audit.IAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/audit")
public class AuditController {
    private final IAuditService auditService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<Audit>> getAllAudit() {
        try {

            List<Audit> auditList = auditService.findAllAudit();
            return ResponseEntity.ok(auditList);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
