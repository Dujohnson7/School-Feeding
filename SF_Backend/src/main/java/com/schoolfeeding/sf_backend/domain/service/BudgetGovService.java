package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.repository.BudgetGovRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetGovService {

    private final BudgetGovRepository budgetGovRepository;

   
    public Budget_Gov createBudget(Budget_Gov budget) {
        return budgetGovRepository.save(budget);
    }

    
    public List<Budget_Gov> getAllBudgets() {
        return budgetGovRepository.findByIsDeletedFalse();
    }

   
    public Budget_Gov getBudgetById(UUID id) {
        return budgetGovRepository.findById(id)
                .filter(b -> !b.getIsDeleted()) 
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
    }

    
    public Budget_Gov updateBudget(UUID id, Budget_Gov budgetDetails) {
        Budget_Gov budget = budgetGovRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));

        budget.setFiscalYear(budgetDetails.getFiscalYear());
        budget.setBudget(budgetDetails.getBudget());
        budget.setDescription(budgetDetails.getDescription());
        budget.setStatus(budgetDetails.getStatus());

        return budgetGovRepository.save(budget);
    }

    
    public void deleteBudget(UUID id) {
        Budget_Gov budget = budgetGovRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
        budget.setIsDeleted(true); 
        budgetGovRepository.save(budget);
    }
}
 
