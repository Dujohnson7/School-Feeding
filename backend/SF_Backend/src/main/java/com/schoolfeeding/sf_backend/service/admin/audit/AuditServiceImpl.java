package com.schoolfeeding.sf_backend.service.admin.audit;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.repository.admin.IAuditRepository;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements IAuditService {

    private final IAuditRepository auditRepository;

    @Override
    public List<Audit> findAllByTimestamp(LocalDateTime timestamp) {
            return auditRepository.findAllByTimestamp(timestamp);
    }

    @Override
    public Audit saveAudit(Audit theAudit) {
        return auditRepository.save(theAudit);
    }

    @Override
    public List<Audit> findAllAudit() {
        return auditRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public List<Audit> findTop4ByOrderByTimestampDesc() {
        return auditRepository.findTop4ByOrderByTimestampDesc();
    }

    @Override
    public long countUserLoginhisWeek(EAction action, LocalDateTime start, LocalDateTime end) {
        return auditRepository.countAuditsByActionAndTimestampBetween(action, start, end);
    }

    @Override
    public List<Object[]> countLoginsPerDayOfWeek(EAction action, LocalDateTime start, LocalDateTime end) {
        return auditRepository.countLoginsPerDayOfWeek(action.name(), start, end);
    }


}
