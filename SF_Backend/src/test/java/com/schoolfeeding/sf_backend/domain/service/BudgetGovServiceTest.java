package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.repository.BudgetGovRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetGovServiceTest {

    @Mock
    private BudgetGovRepository budgetGovRepository;

    @InjectMocks
    private BudgetGovService budgetGovService;

    private Budget_Gov budget;
    private UUID budgetId;

    @BeforeEach
    void setUp() {
        budgetId = UUID.randomUUID();
        budget = new Budget_Gov();
        budget.setId(budgetId);
        budget.setFiscalYear("2025");
        budget.setBudget(5000000.0);
        budget.setDescription("Annual budget");
        budget.setIsDeleted(false);
    }

    @Test
    void createBudget_ShouldSaveBudget() {
        when(budgetGovRepository.save(any(Budget_Gov.class))).thenReturn(budget);

        Budget_Gov saved = budgetGovService.createBudget(new Budget_Gov());

        assertNotNull(saved);
        assertEquals("2025", saved.getFiscalYear());
        verify(budgetGovRepository).save(any(Budget_Gov.class));
    }

    @Test
    void getAllBudgets_ShouldReturnList() {
        when(budgetGovRepository.findByIsDeletedFalse()).thenReturn(Collections.singletonList(budget));

        List<Budget_Gov> budgets = budgetGovService.getAllBudgets();

        assertFalse(budgets.isEmpty());
        verify(budgetGovRepository).findByIsDeletedFalse();
    }

    @Test
    void getBudgetById_ShouldReturnBudget_WhenExists() {
        when(budgetGovRepository.findById(budgetId)).thenReturn(Optional.of(budget));

        Budget_Gov found = budgetGovService.getBudgetById(budgetId);

        assertNotNull(found);
        assertEquals(budgetId, found.getId());
    }

    @Test
    void updateBudget_ShouldUpdateFields() {
        when(budgetGovRepository.findById(budgetId)).thenReturn(Optional.of(budget));
        when(budgetGovRepository.save(any(Budget_Gov.class))).thenReturn(budget);

        Budget_Gov updates = new Budget_Gov();
        updates.setFiscalYear("2026");
        updates.setBudget(6000000.0);

        Budget_Gov updated = budgetGovService.updateBudget(budgetId, updates);

        assertEquals("2026", updated.getFiscalYear());
        assertEquals(6000000.0, updated.getBudget());
        verify(budgetGovRepository).save(any(Budget_Gov.class));
    }

    @Test
    void deleteBudget_ShouldMarkAsDeleted() {
        when(budgetGovRepository.findById(budgetId)).thenReturn(Optional.of(budget));
        when(budgetGovRepository.save(any(Budget_Gov.class))).thenReturn(budget);

        budgetGovService.deleteBudget(budgetId);

        assertTrue(budget.getIsDeleted());
        verify(budgetGovRepository).save(budget);
    }
}
