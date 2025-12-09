package com.schoolfeeding.sf_backend.service.gov.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_District;
import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.repository.admin.IDistrictRepository;
import com.schoolfeeding.sf_backend.repository.district.IBudgetSchoolRepository;
import com.schoolfeeding.sf_backend.repository.gov.IBudgetGovRepository;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.district.budget.IBudgetDistrictService;
import com.schoolfeeding.sf_backend.service.district.budget.IBudgetSchoolService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.util.audit.Auditable;
import com.schoolfeeding.sf_backend.util.audit.EAction;
import com.schoolfeeding.sf_backend.util.audit.EResource;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import lombok.RequiredArgsConstructor;
import org.hibernate.ObjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetGovServiceImpl implements IBudgetGovService {

    private final IBudgetGovRepository budgetRepository;
    private final IBudgetDistrictService  budgetDistrictService;
    private final IDistrictService districtService;
    private final ISchoolService schoolService;

    @Override
    @Auditable(action = EAction.CREATE, resource = EResource.GOV)
    public Budget_Gov budgetSave(Budget_Gov theBudget_gov) {

        if (theBudget_gov.getBudget() > 0) {

            long totalStudents = schoolService.sumByStudentAndState(Boolean.TRUE);

            long budgetPerStudent = (long)theBudget_gov.getBudget() / totalStudents;

            List<District> districts = districtService.findAllDistrictsAndState(Boolean.TRUE);

            for (District district : districts) {

                long districtStudents = schoolService.sumAllByDistrictStudentAndState(district.getId());
                long districtBudget = districtStudents * budgetPerStudent;

                Budget_District budgetDistrict = new Budget_District();
                budgetDistrict.setBudget(districtBudget);
                budgetDistrict.setBudgetGov(theBudget_gov);
                budgetDistrict.setDistrict(district);
                if (theBudget_gov.getStatus() == true) {
                    budgetDistrict.setBudgetStatus(EBudget.ON_TRACK);
                }else {
                    budgetDistrict.setBudgetStatus(EBudget.OFF_TRACK);
                }
                budgetDistrictService.saveBudgetDistrict(budgetDistrict);
            }
        }
        return budgetRepository.save(theBudget_gov);
    }


    @Override
    @Auditable(action = EAction.UPDATE, resource = EResource.GOV)
    public Budget_Gov budgetUpdate(Budget_Gov theBudget_gov) {
        Budget_Gov found = findByIdAndState(theBudget_gov.getId(), Boolean.TRUE);
        if(Objects.isNull(found)){
            found.setFiscalYear(theBudget_gov.getFiscalYear());
            found.setDescription(theBudget_gov.getDescription());
            found.setBudget(theBudget_gov.getBudget());
            found.setStatus(theBudget_gov.getStatus());
            return budgetRepository.save(found);
        }
        throw new ObjectNotFoundException(Budget_Gov.class, "BUDGET NOT FOUND");
    }

    @Override
    @Auditable(action = EAction.DELETE, resource = EResource.GOV)
    public Budget_Gov budgetDelete(Budget_Gov theBudget_gov) {
        Budget_Gov found = findByIdAndState(theBudget_gov.getId(), Boolean.TRUE);
        if(Objects.isNull(found)){
            found.setActive(Boolean.FALSE);
            return budgetRepository.save(found);
        }
        throw new ObjectNotFoundException(Budget_Gov.class, "BUDGET NOT FOUND");
    }

    @Override
    public Budget_Gov findByIdAndState(UUID id, Boolean state) {
        Budget_Gov theBudget = budgetRepository.findByIdAndActive(id, state).orElseThrow( () -> new ObjectNotFoundException(Budget_Gov.class, "Budget Not Found"));
        return theBudget;
    }

    @Override
    public double findCurrentBudget(Boolean status) {
        return budgetRepository.findCurrentBudgetAndActive(Boolean.TRUE, Boolean.TRUE);
    }

    @Override
    public List<Budget_Gov> findAllByActive(Boolean active) {
        return budgetRepository.findAllByActive(Boolean.TRUE);
    }
}
