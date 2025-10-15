package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.DistrictDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.service.DistrictService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @PostMapping
    public ResponseEntity<District> createDistrict(@Valid @RequestBody DistrictDTO dto) {
        District district = districtService.createDistrict(dto);
        return new ResponseEntity<>(district, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<District>> getAllDistricts() {
        List<District> districts = districtService.findAllDistricts();
        return ResponseEntity.ok(districts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable UUID id) {
        District district = districtService.getDistrictById(id);
        return ResponseEntity.ok(district);
    }

    @PutMapping("/{id}")
    public ResponseEntity<District> updateDistrict(@PathVariable UUID id, @Valid @RequestBody DistrictDTO dto) {
        District updatedDistrict = districtService.updateDistrict(id, dto);
        return ResponseEntity.ok(updatedDistrict);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDistrict(@PathVariable UUID id) {
        districtService.deleteDistrict(id);
    }
}
