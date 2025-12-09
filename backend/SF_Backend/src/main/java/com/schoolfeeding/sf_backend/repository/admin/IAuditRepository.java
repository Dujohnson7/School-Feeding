package com.schoolfeeding.sf_backend.repository.admin;

import com.schoolfeeding.sf_backend.domain.entity.Audit;
import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IAuditRepository extends JpaRepository<Audit, LocalDateTime> {
    List<Audit> findAllByTimestamp(LocalDateTime timestamp);
    List<Audit> findAllByOrderByTimestampDesc();
    List<Audit> findTop4ByOrderByTimestampDesc();

    long countAuditsByActionAndTimestampBetween(EAction action, LocalDateTime timestampAfter, LocalDateTime timestampBefore);

    @Query(value = """
      SELECT 
          EXTRACT(DOW FROM timestamp) AS day_of_week,
          COUNT(*) 
      FROM audit 
      WHERE action = :action
        AND timestamp BETWEEN :start AND :end
      GROUP BY EXTRACT(DOW FROM timestamp)
      ORDER BY day_of_week
""", nativeQuery = true)
    List<Object[]> countLoginsPerDayOfWeek(
            @Param("action") String action,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}
