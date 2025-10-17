package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.domain.repository.StockInRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockInService {

    private final StockInRepository stockInRepository;

    // Create
    public StockIn createStockIn(StockIn stockIn) {
        return stockInRepository.save(stockIn);
    }

    // Get all active
    public List<StockIn> getAllStockIns() {
        return stockInRepository.findByIsDeletedFalse();
    }

    // Get by ID
    public StockIn getStockInById(UUID id) {
        return stockInRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StockIn not found with id " + id));
    }

    // Update
    public StockIn updateStockIn(UUID id, StockIn updatedStockIn) {
        StockIn existing = getStockInById(id);
        existing.setSchool(updatedStockIn.getSchool());
        existing.setOrders(updatedStockIn.getOrders());
        existing.setItem(updatedStockIn.getItem());
        existing.setQuantity(updatedStockIn.getQuantity());
        existing.setExpirationDate(updatedStockIn.getExpirationDate());
        return stockInRepository.save(existing);
    }

    // Soft delete
    public void deleteStockIn(UUID id) {
        StockIn existing = getStockInById(id);
        existing.setIsDeleted(true);
        stockInRepository.save(existing);
    }
}
