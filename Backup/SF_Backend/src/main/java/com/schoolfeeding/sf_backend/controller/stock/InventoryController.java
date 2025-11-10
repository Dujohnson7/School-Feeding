package com.schoolfeeding.sf_backend.controller.stock;

import com.schoolfeeding.sf_backend.domain.entity.Stock;
import com.schoolfeeding.sf_backend.service.stock.stock.IStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final IStockService stockService;

    @GetMapping("/all/{sId}")
    public ResponseEntity<List<Stock>> getAllStock(@PathVariable String sId) {
        try {
            List<Stock> theStockList = stockService.findAllBySchool(UUID.fromString(sId));
            if (theStockList != null && !theStockList.isEmpty()) {
                return ResponseEntity.ok(theStockList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


}
