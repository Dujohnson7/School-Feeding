package com.schoolfeeding.sf_backend.service.district.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_School;
import com.schoolfeeding.sf_backend.util.budget.EBudget;

import java.util.List;
import java.util.UUID;

public interface IBudgetSchoolService {
    Budget_School saveBudgetSchool(Budget_School budgetSchool);
    List<Budget_School> findAllByDistrictId(UUID districtId);
    List<Budget_School> findAllByBudgetDistrictId(UUID districtId);
    List<Budget_School> findAllByBudgetDistrict_IdAndBudgetStatus(UUID districtId, EBudget budgetStatus);
}
