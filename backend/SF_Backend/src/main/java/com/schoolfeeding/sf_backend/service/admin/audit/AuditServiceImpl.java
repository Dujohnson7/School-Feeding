package com.schoolfeeding.sf_backend.service.admin.audit;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.repository.admin.IAuditRepository;
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
}
