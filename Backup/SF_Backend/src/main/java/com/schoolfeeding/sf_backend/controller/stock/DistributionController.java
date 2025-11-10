package com.schoolfeeding.sf_backend.controller.stock;

import com.schoolfeeding.sf_backend.domain.entity.Orders;
import com.schoolfeeding.sf_backend.domain.entity.StockOut;
import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.stock.stockOut.IStockOutService;
import com.schoolfeeding.sf_backend.util.role.ERole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/distribute")
public class DistributionController {

    private final IStockOutService  stockOutService;

    @GetMapping("/all/{sId}")
    public ResponseEntity<List<StockOut>> getAllStockOut(@PathVariable String sId) {
        try {
            List<StockOut> theStockOutList = stockOutService.findAllBySchool(UUID.fromString(sId));
            if (theStockOutList != null && !theStockOutList.isEmpty()) {
                return ResponseEntity.ok(theStockOutList);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerStockout(@RequestBody StockOut theStockOut){
        try {
            if (Objects.nonNull(theStockOut)) {
                StockOut saveStock = stockOutService.saveStockOut(theStockOut);
                return ResponseEntity.ok(saveStock);
            }else {
                return ResponseEntity.badRequest().body("Invalid STOCKOUT Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error STOCKOUT Registration: " + ex.getMessage());
        }
    }


}
