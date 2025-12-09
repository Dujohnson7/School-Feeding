package com.schoolfeeding.sf_backend.repository.district;

import com.schoolfeeding.sf_backend.domain.entity.Budget_School;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IBudgetSchoolRepository extends JpaRepository<Budget_School, UUID> {
    List<Budget_School> findAllByBudgetDistrict_IdAndActive(UUID districtId, Boolean active);
    List<Budget_School> findAllByBudgetDistrict_IdAndBudgetStatusAndActive(UUID districtId, EBudget budgetStatus, Boolean active);
}
