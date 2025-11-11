package com.schoolfeeding.sf_backend.controller.stock;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.StockOut;
import com.schoolfeeding.sf_backend.service.stock.stockOut.IStockOutService;
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


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStockOut(@RequestBody StockOut theStockOut, @PathVariable String id) {
        try {
            StockOut existStockOut = stockOutService.findStockOutById(UUID.fromString(id));
            if (existStockOut != null) {
                theStockOut.setId(UUID.fromString(id));
                StockOut stockoutSave = stockOutService.updateStockOut(theStockOut);
                return ResponseEntity.ok(stockoutSave);
            }else  {
                return ResponseEntity.badRequest().body("Invalid StockOut Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStockOut(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                StockOut stockout = new StockOut();
                stockout.setId(UUID.fromString(id));
                stockOutService.deleteStockOut(stockout);
                return ResponseEntity.ok().body("Delete Success");
            }else {
                return ResponseEntity.badRequest().body("Invalid stockout Id");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStockOutById(@PathVariable String id) {
        try {
            StockOut theStockOut = stockOutService.findStockOutById(UUID.fromString(id));
            if (theStockOut != null) {
                return ResponseEntity.ok(theStockOut);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: "+ ex.getMessage());
        }
    }


}
