package com.schoolfeeding.sf_backend.service.district.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_School;
import com.schoolfeeding.sf_backend.repository.district.IBudgetSchoolRepository;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class BudgetSchoolServiceImpl implements IBudgetSchoolService{

    final IBudgetSchoolRepository budgetSchoolRepository;

    @Override
    public Budget_School saveBudgetSchool(Budget_School budgetSchool) {
        return budgetSchoolRepository.save(budgetSchool);
    }

    @Override
    public List<Budget_School> findAllByDistrictId(UUID districtId) {
        return budgetSchoolRepository.findAllByBudgetDistrict_IdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<Budget_School> findAllByBudgetDistrictId(UUID districtId) {
        return budgetSchoolRepository.findAllByBudgetDistrict_IdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<Budget_School> findAllByBudgetDistrict_IdAndBudgetStatus(UUID districtId, EBudget budgetStatus) {
        return budgetSchoolRepository.findAllByBudgetDistrict_IdAndBudgetStatusAndActive(districtId, EBudget.ON_TRACK, Boolean.TRUE);
    }
}
