package com.schoolfeeding.sf_backend.service.district.budget;

import com.schoolfeeding.sf_backend.domain.entity.Budget_District;
import com.schoolfeeding.sf_backend.domain.entity.Budget_School;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.repository.district.IBudgetDistrictRepository;
import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import com.schoolfeeding.sf_backend.util.budget.EBudget;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@RequiredArgsConstructor
@Service
public class BudgetDistrictServiceImpl implements IBudgetDistrictService {

    private final IBudgetDistrictRepository budgetDistrictRepository;
    private final IDistrictService districtService;
    private final ISchoolService schoolService;
    private final IBudgetSchoolService  budgetSchoolService;

    @Override
    public Budget_District saveBudgetDistrict(Budget_District theBudgetDistrict) {
        if (theBudgetDistrict.getBudget() > 0) {

            long totalStudents = schoolService.sumAllByDistrictStudentAndState(theBudgetDistrict.getDistrict().getId());

            long budgetPerStudent = (long)theBudgetDistrict.getBudget() / totalStudents;

            List<School> schoolList = schoolService.findAllByDistrict(theBudgetDistrict.getDistrict().getDistrict());


            for (School school : schoolList) {

                int schoolStudent = school.getStudent();
                long schoolBudget = schoolStudent * budgetPerStudent;

                Budget_School  budgetSchool = new Budget_School();
                budgetSchool.setBudget(schoolBudget);
                budgetSchool.setBudgetDistrict(theBudgetDistrict);
                budgetSchool.setBudgetStatus(theBudgetDistrict.getBudgetStatus());
                budgetSchoolService.saveBudgetSchool(budgetSchool);

            }
        }
        return budgetDistrictRepository.save(theBudgetDistrict);
    }


    @Override
    public List<Budget_District> findAllByDistrictId(UUID districtId) {
        return budgetDistrictRepository.findAllByDistrictIdAndActive(districtId, Boolean.TRUE);
    }

    @Override
    public List<Budget_District> findAllByDistrict_IdAndBudgetGov_Id(UUID districtId, UUID budgetGovId) {
        return budgetDistrictRepository.findAllByDistrict_IdAndBudgetGov_IdAndActive(districtId, budgetGovId, Boolean.TRUE);
    }

    @Override
    public List<Budget_District> findAllByDistrict_IdAndBudgetStatus(UUID districtId, EBudget budgetStatus) {
        return budgetDistrictRepository.findAllByDistrict_IdAndBudgetStatusAndActive(districtId, EBudget.ON_TRACK, Boolean.TRUE);
    }
}
