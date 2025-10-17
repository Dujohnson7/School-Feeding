package com.schoolfeeding.sf_backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardSummaryDTO {
    private long totalUsers;
    private long activeSchools;
    private long totalDistricts;
}
