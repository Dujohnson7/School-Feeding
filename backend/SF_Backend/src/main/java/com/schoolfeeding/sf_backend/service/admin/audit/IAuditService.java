package com.schoolfeeding.sf_backend.service.admin.audit;

import com.schoolfeeding.sf_backend.domain.entity.Audit;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IAuditService {
    List<Audit> findAllByTimestamp(LocalDateTime timestamp);
    Audit saveAudit(Audit theAudit);
    List<Audit> findAllAudit();
}
