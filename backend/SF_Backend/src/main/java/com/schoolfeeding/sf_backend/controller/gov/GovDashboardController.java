package com.schoolfeeding.sf_backend.controller.gov;

import com.schoolfeeding.sf_backend.service.admin.district.IDistrictService;
import com.schoolfeeding.sf_backend.service.gov.budget.IBudgetGovService;
import com.schoolfeeding.sf_backend.service.gov.school.ISchoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/govDashboard")
public class GovDashboardController {

    private final ISchoolService schoolService;
    private final IDistrictService districtService;
    private final IBudgetGovService  budgetGovService;

    @GetMapping("/totalSchool")
    public ResponseEntity<Long> getTotalSchool() {
        try {
            long totalSchool = schoolService.countAllSchools(Boolean.TRUE);
            return ResponseEntity.ok(totalSchool);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalStudent")
    public ResponseEntity<Long> getTotalStudent() {
        try {
            long totalStudent = schoolService.sumByStudentAndState(Boolean.TRUE);
            return ResponseEntity.ok(totalStudent);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/totalDistrict")
    public ResponseEntity<Long> getTotalDistricts() {
        try {
            long totalDistrict = districtService.countDistrictsAndState(Boolean.TRUE);
            return ResponseEntity.ok(totalDistrict);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/currentBudget")
    public ResponseEntity<Double> getCurrentBudget() {
        try {
            Double currentBudget = budgetGovService.findCurrentBudget(Boolean.TRUE);
            return ResponseEntity.ok(currentBudget);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
