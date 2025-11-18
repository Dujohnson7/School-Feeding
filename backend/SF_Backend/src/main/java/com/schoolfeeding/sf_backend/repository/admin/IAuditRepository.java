package com.schoolfeeding.sf_backend.repository.admin;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface IAuditRepository extends JpaRepository<Audit, LocalDateTime> {
    List<Audit> findAllByTimestamp(LocalDateTime timestamp);
    List<Audit> findAllByOrderByTimestampDesc();
}
