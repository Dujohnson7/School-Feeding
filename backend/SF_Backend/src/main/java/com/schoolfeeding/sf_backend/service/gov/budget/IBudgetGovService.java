package com.schoolfeeding.sf_backend.service.gov.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;

import java.util.List;
import java.util.UUID;

public interface IBudgetGovService {
    Budget_Gov budgetSave(Budget_Gov theBudget_gov);
    Budget_Gov budgetUpdate(Budget_Gov theBudget_gov);
    Budget_Gov budgetDelete(Budget_Gov theBudget_gov);
    Budget_Gov findByIdAndState(UUID id, Boolean state);
    List<Budget_Gov> findAllByActive(Boolean active);
}
