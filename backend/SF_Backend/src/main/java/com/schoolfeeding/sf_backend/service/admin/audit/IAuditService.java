package com.schoolfeeding.sf_backend.service.admin.audit;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.util.audit.EAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IAuditService {
    List<Audit> findAllByTimestamp(LocalDateTime timestamp);
    Audit saveAudit(Audit theAudit);
    List<Audit> findAllAudit();
    List<Audit> findTop4ByOrderByTimestampDesc();
    long countUserLoginhisWeek(EAction action, LocalDateTime start, LocalDateTime end);
    List<Object[]> countLoginsPerDayOfWeek(EAction action, LocalDateTime start, LocalDateTime end);


}
