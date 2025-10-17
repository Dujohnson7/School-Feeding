package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.domain.service.StockInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/stock-ins")
@RequiredArgsConstructor
public class StockInController {

    private final StockInService stockInService;

    // ✅ Create
    @PostMapping
    public ResponseEntity<StockIn> createStockIn(@RequestBody StockIn stockIn) {
        return ResponseEntity.ok(stockInService.createStockIn(stockIn));
    }

    // ✅ Get all active
    @GetMapping
    public ResponseEntity<List<StockIn>> getAllStockIns() {
        return ResponseEntity.ok(stockInService.getAllStockIns());
    }

    // ✅ Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<StockIn> getStockInById(@PathVariable UUID id) {
        return ResponseEntity.ok(stockInService.getStockInById(id));
    }

    // ✅ Update
    @PutMapping("/{id}")
    public ResponseEntity<StockIn> updateStockIn(
            @PathVariable UUID id,
            @RequestBody StockIn stockIn) {
        return ResponseEntity.ok(stockInService.updateStockIn(id, stockIn));
    }

    // ✅ Soft Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStockIn(@PathVariable UUID id) {
        stockInService.deleteStockIn(id);
        return ResponseEntity.ok("StockIn marked as deleted successfully.");
    }
}
