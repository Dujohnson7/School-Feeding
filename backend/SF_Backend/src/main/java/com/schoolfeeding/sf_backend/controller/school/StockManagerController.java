package com.schoolfeeding.sf_backend.controller.school;

import com.schoolfeeding.sf_backend.domain.entity.Users;
import com.schoolfeeding.sf_backend.service.admin.user.IUsersService;
import com.schoolfeeding.sf_backend.util.role.ERole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stockManager")
public class StockManagerController {

    private final IUsersService usersService;

    @GetMapping("/all/{sId}")
    public ResponseEntity<?> getAllStockKeepers(@PathVariable String sId) {
        try {
            List<Users> theStockKepperList = usersService.findUsersBySchoolAndRoleAndState(UUID.fromString(sId), ERole.STOCK_KEEPER, Boolean.TRUE);

            if (theStockKepperList.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(theStockKepperList);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error StockKeeper: " + ex.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUsers(@RequestBody Users theStockKeeper){
        try {
            if (theStockKeeper != null) {
                theStockKeeper.setRole(ERole.STOCK_KEEPER);
                Users supplierSave = usersService.save(theStockKeeper);
                return ResponseEntity.ok(supplierSave);
            }else {
                return ResponseEntity.badRequest().body("Invalid StockKeeper Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error StockKeeper Registration: " + ex.getMessage());
        }
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUsers(@RequestBody Users theStockKeeper, @PathVariable String id) {
        try {
            Users existUsers = usersService.findByIdAndActive(UUID.fromString(id));
            if (!Objects.isNull(existUsers)) {
                theStockKeeper.setId(UUID.fromString(id));
                Users updatedUsers = usersService.update(existUsers);
                return ResponseEntity.ok(updatedUsers);
            } else {
                return ResponseEntity.badRequest().body("Invalid StockKeeper ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error StockKeeper Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUsers(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Users theStockKeeper = new Users();
                theStockKeeper.setId(UUID.fromString(id));
                usersService.delete(theStockKeeper);
                return ResponseEntity.ok("StockKeeper Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid StockKeeper ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error StockKeeper Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsers(@PathVariable String id) {
        try {
            Users theStockKeeper = usersService.findByIdAndActive(UUID.fromString(id));
            if (!Objects.isNull(theStockKeeper)) {
                return ResponseEntity.ok(theStockKeeper);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("StockKeeper not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error StockKeeper: " + ex.getMessage());
        }
    }


}
