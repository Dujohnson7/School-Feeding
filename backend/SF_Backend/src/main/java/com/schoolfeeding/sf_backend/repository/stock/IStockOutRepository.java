package com.schoolfeeding.sf_backend.repository.stock;

import com.schoolfeeding.sf_backend.domain.entity.StockOut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IStockOutRepository extends JpaRepository<StockOut, UUID> {
    Optional<StockOut> findByIdAndActive(UUID id, Boolean active);
    List<StockOut> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);
}
