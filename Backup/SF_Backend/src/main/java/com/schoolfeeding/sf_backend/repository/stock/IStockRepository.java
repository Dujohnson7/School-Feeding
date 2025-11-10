package com.schoolfeeding.sf_backend.repository.stock;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IStockRepository extends JpaRepository<Stock, UUID> {
    Optional<Stock> findByIdAndActive(UUID id, Boolean active);
    Optional<Stock> findByItemIdAndSchoolIdAndActive(UUID itemId, UUID schoolId, Boolean active);
    List<Stock> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);
}
