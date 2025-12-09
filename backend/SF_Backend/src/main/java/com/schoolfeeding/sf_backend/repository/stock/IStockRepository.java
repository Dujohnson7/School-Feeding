package com.schoolfeeding.sf_backend.repository.stock;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.util.stock.EStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IStockRepository extends JpaRepository<Stock, UUID> {
    Optional<Stock> findByIdAndActive(UUID id, Boolean active);
    List<Stock> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);
    @Query("SELECT s FROM Stock s WHERE s.item.id = :itemId AND s.school.id = :schoolId AND s.active = :active ")
    Optional<Stock> findByItemIdAndSchoolIdAndActive(UUID itemId, UUID schoolId, Boolean active);
    long countAllBySchoolIdAndActive(UUID schoolId, Boolean active);
    long countAllBySchoolIdAndItemIdAndActive(UUID schoolId, UUID itemId, Boolean active);
    long countAllBySchoolIdAndStockStateAndActive(UUID schoolId, EStock stockState, Boolean active);
}
