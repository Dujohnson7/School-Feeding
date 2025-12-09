package com.schoolfeeding.sf_backend.repository.stock;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IStockInRepository extends JpaRepository<StockIn, UUID> {
    Optional<StockIn> findByIdAndActive(UUID id, Boolean active);
    List<StockIn> findAllBySchoolIdAndActive(UUID schoolId, Boolean active);

    @Query("SELECT s FROM StockIn s WHERE s.expirationDate < CURRENT_DATE")
    List<StockIn> findExpiredProducts();

    @Query("SELECT s FROM StockIn s WHERE s.expirationDate BETWEEN CURRENT_DATE AND :futureDate")
    List<StockIn> findProductsExpiringSoon(Date futureDate);
}
