package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockInRepository extends JpaRepository<StockIn, UUID> {
    // Only get records that are not deleted
    List<StockIn> findByIsDeletedFalse();
}
