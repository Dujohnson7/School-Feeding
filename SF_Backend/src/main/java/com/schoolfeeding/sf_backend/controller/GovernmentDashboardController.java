package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.GovernmentDashboardDTO;
import com.schoolfeeding.sf_backend.domain.service.GovernmentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gov/dashboard")
@RequiredArgsConstructor
public class GovernmentDashboardController {

    private final GovernmentDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<GovernmentDashboardDTO> getDashboard() {
        GovernmentDashboardDTO dto = dashboardService.getDashboard();
        return ResponseEntity.ok(dto);
    }
}
