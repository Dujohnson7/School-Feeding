package com.schoolfeeding.sf_backend.service.district.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_District;
import com.schoolfeeding.sf_backend.util.budget.EBudget;

import java.util.List;
import java.util.UUID;

public interface IBudgetDistrictService {
    Budget_District saveBudgetDistrict(Budget_District theBudgetDistrict);
    List<Budget_District> findAllByDistrictId(UUID districtId);
    List<Budget_District>findAllByDistrict_IdAndBudgetGov_Id(UUID districtId, UUID budgetGovId);
    List<Budget_District> findAllByDistrict_IdAndBudgetStatus(UUID districtId, EBudget budgetStatus);
}
