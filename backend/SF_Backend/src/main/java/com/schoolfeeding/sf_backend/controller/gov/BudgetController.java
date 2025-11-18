package com.schoolfeeding.sf_backend.controller.gov;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.service.gov.budget.IBudgetGovService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/budgetGov")
public class BudgetController {

    private final IBudgetGovService budgetGovService;

    @GetMapping({"","/all"})
    public ResponseEntity<List<Budget_Gov>> getAllBudgetGov (){
        try {

            List<Budget_Gov> budgetGovList = budgetGovService.findAllByActive(Boolean.TRUE);
            return ResponseEntity.ok(budgetGovList);

        }catch (Exception ex){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerBudgetGov(@RequestBody Budget_Gov theBudgetGov){

        try {
            if (theBudgetGov != null) {
                Budget_Gov budgetGov = budgetGovService.budgetSave(theBudgetGov);
                return ResponseEntity.ok(budgetGov);
            }else {
                return ResponseEntity.badRequest().body("Invalid Budget Gov Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error Budget Gov Registration: " + ex.getMessage());
        }
    }


    @PostMapping("/allocateBudget")
    public ResponseEntity<?>  registerAllocateBudget(@RequestBody Budget_Gov theBudgetGov){

        try {
            if (theBudgetGov != null) {
                Budget_Gov budgetGov = budgetGovService.budgetSave(theBudgetGov);
                return ResponseEntity.ok(budgetGov);
            }else {
                return ResponseEntity.badRequest().body("Invalid Budget Gov Data");
            }
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error Budget Gov Registration: " + ex.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBudgetGov(@RequestBody Budget_Gov theBudget_Gov, @PathVariable String id) {
        try {
            Budget_Gov existBudgetGov = budgetGovService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(existBudgetGov)) {
                theBudget_Gov.setId(UUID.fromString(id));
                Budget_Gov updatedBudget_Gov = budgetGovService.budgetUpdate(theBudget_Gov);
                return ResponseEntity.ok(updatedBudget_Gov);
            } else {
                return ResponseEntity.badRequest().body("Invalid Budget Gov ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Budget Gov Update: " + ex.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBudgetGov(@PathVariable String id) {
        try {
            if (!Objects.isNull(id)) {
                Budget_Gov theBudgetGov = new Budget_Gov();
                theBudgetGov.setId(UUID.fromString(id));
                budgetGovService.budgetDelete(theBudgetGov);
                return ResponseEntity.ok("Budget Gov Deleted Successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid Budget Gov ID");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Budget_Gov Delete: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetGov(@PathVariable String id) {
        try {
            Budget_Gov theBudgetGov = budgetGovService.findByIdAndState(UUID.fromString(id), Boolean.TRUE);
            if (!Objects.isNull(theBudgetGov)) {
                return ResponseEntity.ok(theBudgetGov);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Budget Gov not found");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error Budget Gov: " + ex.getMessage());
        }
    }
}
