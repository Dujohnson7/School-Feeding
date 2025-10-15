package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.AdminDashboardSummaryDTO;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import com.schoolfeeding.sf_backend.domain.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UsersRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final DistrictRepository districtRepository;

    public AdminDashboardSummaryDTO getDashboardSummary() {
        long totalUsers = userRepository.count();
        long activeSchools = schoolRepository.countByActiveTrueAndIsDeletedFalse();
        long totalDistricts = districtRepository.countByIsDeletedFalse();

        return new AdminDashboardSummaryDTO(totalUsers, activeSchools, totalDistricts);
    }
}


