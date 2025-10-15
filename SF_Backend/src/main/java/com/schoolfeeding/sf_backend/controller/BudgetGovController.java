package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.service.BudgetGovService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetGovController {

    private final BudgetGovService budgetGovService;

    
    @PostMapping
    public ResponseEntity<Budget_Gov> createBudget(@RequestBody Budget_Gov budget) {
        return ResponseEntity.ok(budgetGovService.createBudget(budget));
    }

   
    @GetMapping
    public ResponseEntity<List<Budget_Gov>> getAllBudgets() {
        return ResponseEntity.ok(budgetGovService.getAllBudgets());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Budget_Gov> getBudgetById(@PathVariable UUID id) {
        return ResponseEntity.ok(budgetGovService.getBudgetById(id));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Budget_Gov> updateBudget(@PathVariable UUID id,
                                                   @RequestBody Budget_Gov budget) {
        return ResponseEntity.ok(budgetGovService.updateBudget(id, budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(@PathVariable UUID id) {
        budgetGovService.deleteBudget(id);
        return ResponseEntity.ok("Budget deleted (soft delete)");
    }
}

