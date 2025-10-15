package com.schoolfeeding.sf_backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class GovernmentDashboardDTO {

    private long totalStudents;
    private long totalSchools;
    private long totalDistricts;
    private long activeBudgets;

    
    private Map<String, Long> participationByProvince;

   
    private double usedBudgetRate;            
    private double feedingParticipationRate;  
    private double supplierPerformanceRate;   
    private double deliveryRate;              

    
    private Map<String, Double> foodDistributedByMonth;  
}
