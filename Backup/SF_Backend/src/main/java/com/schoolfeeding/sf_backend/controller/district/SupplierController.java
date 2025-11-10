package com.schoolfeeding.sf_backend.controller.district;

import com.schoolfeeding.sf_backend.domain.entity.Item;
import com.schoolfeeding.sf_backend.domain.entity.Supplier;
import com.schoolfeeding.sf_backend.service.district.supplier.ISupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/supplier")
public class SupplierController {

    private final ISupplierService supplierService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<Supplier>> getAllSuppliers (){
        try {
            List<Supplier> supplierList = supplierService.findAllByState(Boolean.TRUE);
            return ResponseEntity.ok(supplierList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all/{dId}")
    public ResponseEntity<?> getAllSuppliersByDistrict(@PathVariable String dId) {
        try {
            List<Supplier> supplierList = supplierService.findAllByDistrictAndAState(UUID.fromString(dId), Boolean.TRUE);

            if (supplierList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(supplierList);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Supplier: " + ex.getMessage());
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerSupplier(@RequestBody Supplier theSupplier){
        try {
            if (theSupplier != null) {
                Supplier supplierSave = supplierService.saveSupplier(theSupplier);
                return ResponseEntity.ok(supplierSave);
            }else {
                return ResponseEntity.badRequest().body("Invalid Supplier Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error Supplier Registration: " + ex.getMessage());
        }
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSupplier(@RequestBody Supplier theSupplier, @PathVariable String id) {
        try {
            Supplier existSupplier = supplierService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existSupplier)) {
                theSupplier.setId(UUID.fromString(id));
                Supplier updatedSupplier = supplierService.updateSupplier(existSupplier);
                return ResponseEntity.ok(updatedSupplier);
            } else {
                return ResponseEntity.badRequest().body("Invalid Supplier ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Supplier Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Supplier theSupplier = new Supplier();
                theSupplier.setId(UUID.fromString(id));
                supplierService.deleteSupplier(theSupplier);
                return ResponseEntity.ok("Supplier Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Supplier ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Supplier Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplier(@PathVariable String id) {
        try {
            Supplier theSupplier = supplierService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theSupplier)) {
                return ResponseEntity.ok(theSupplier);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Supplier not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Supplier: " + ex.getMessage());
        }
    }


    @GetMapping("/items/{sId}")
    public ResponseEntity<?> getSupplierItems(@PathVariable String sId) {
        try {
            List<Item> theSupplierList = supplierService.findItemBySupplierId(UUID.fromString(sId), Boolean.TRUE);

            if (theSupplierList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No items found for this supplier");
            }
            return ResponseEntity.ok(theSupplierList);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Supplier: " + ex.getMessage());
        }
    }

}
