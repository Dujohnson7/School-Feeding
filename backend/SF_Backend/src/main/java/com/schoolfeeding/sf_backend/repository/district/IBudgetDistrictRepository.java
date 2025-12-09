package com.schoolfeeding.sf_backend.repository.district;

import com.schoolfeeding.sf_backend.domain.entity.Budget_District;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IBudgetDistrictRepository extends JpaRepository<Budget_District, UUID> {
    List<Budget_District> findAllByDistrictIdAndActive(UUID districtId, Boolean active);
    List<Budget_District> findAllByDistrict_IdAndBudgetGov_IdAndActive(UUID districtId, UUID budgetGovId, Boolean active);
    List<Budget_District> findAllByDistrict_IdAndBudgetStatusAndActive(UUID districtId, EBudget budgetStatus, Boolean active);
}
