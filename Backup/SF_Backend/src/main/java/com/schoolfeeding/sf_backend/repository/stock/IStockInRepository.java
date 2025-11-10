package com.schoolfeeding.sf_backend.repository.stock;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IStockInRepository extends JpaRepository<StockIn, UUID> {
    Optional<StockIn> findByIdAndActive(UUID id, Boolean active);
    List<StockIn> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);
}
