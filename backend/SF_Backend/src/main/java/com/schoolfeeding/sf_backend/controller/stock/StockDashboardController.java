package com.schoolfeeding.sf_backend.controller.stock;

import com.schoolfeeding.sf_backend.domain.entity.StockIn;
import com.schoolfeeding.sf_backend.service.stock.stockIn.IStockInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stockDashboard")
public class StockDashboardController {

    private final IStockInService stockService;

    @GetMapping("/expired")
    public ResponseEntity<List<StockIn>> getExpiredStock() {
        return ResponseEntity.ok(stockService.getExpiredProducts());
    }

    @GetMapping("/expiring-soon/{days}")
    public ResponseEntity<List<StockIn>> getExpiringSoon(@PathVariable int days) {
        return ResponseEntity.ok(stockService.getProductsExpiringSoon(days));
    }
}
