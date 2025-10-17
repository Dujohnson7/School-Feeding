package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.GovernmentDashboardDTO;
import com.schoolfeeding.sf_backend.domain.entity.Budget_Gov;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.repository.BudgetGovRepository;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GovernmentDashboardService {

    private final BudgetGovRepository budgetRepo;
    private final SchoolRepository schoolRepo;
    private final DistrictRepository districtRepo;

    public GovernmentDashboardDTO getDashboard() {

        List<Budget_Gov> budgets = budgetRepo.findAll();
        List<School> schools = schoolRepo.findAll();
        List<District> districts = districtRepo.findAll();

        
        long totalStudents = schools.stream()
                .mapToLong(s -> s.getNumberStudent() != null ? s.getNumberStudent() : 0)
                .sum();

        long totalSchools = schools.size();
        long totalDistricts = districts.size();
        long activeBudgets = budgets.stream().filter(Budget_Gov::getStatus).count();

       
        Map<String, Long> participationByProvince = new HashMap<>();
        for (School s : schools) {
            String province = "Unknown";

            if (s.getDistrict() != null && s.getDistrict().getDistrict() != null) {
                EDistrict districtEnum = s.getDistrict().getDistrict();
                EProvince provEnum = districtEnum.getProvince();
                province = provEnum != null ? provEnum.name() : "Unknown";
            }

            long studentsFed = s.getNumberStudent() != null ? s.getNumberStudent() : 0; // dummy for fed
            participationByProvince.put(
                    province,
                    participationByProvince.getOrDefault(province, 0L) + studentsFed
            );
        }

        
        double usedBudget = 0; 
        double usedBudgetRate = 0;

        double feedingParticipationRate = totalStudents > 0
                ? participationByProvince.values().stream().mapToLong(Long::longValue).sum() * 100.0 / totalStudents
                : 0;

        double supplierPerformanceRate = 90.0; 
        double deliveryRate = 95.0;        

        Map<String, Double> foodDistributedByMonth = new HashMap<>();
        for (Month m : Month.values()) {
            foodDistributedByMonth.put(m.name(), Math.random() * 1000); 
        }

        return new GovernmentDashboardDTO(
                totalStudents,
                totalSchools,
                totalDistricts,
                activeBudgets,
                participationByProvince,
                usedBudgetRate,
                feedingParticipationRate,
                supplierPerformanceRate,
                deliveryRate,
                foodDistributedByMonth
        );
    }
}
