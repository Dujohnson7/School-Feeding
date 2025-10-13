package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.DistrictDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.service.DistrictService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    // POST /api/districts (Create District)
    @PostMapping
    public ResponseEntity<District> createDistrict(@Valid @RequestBody DistrictDTO dto) {
        District district = districtService.createDistrict(dto);
        return new ResponseEntity<>(district, HttpStatus.CREATED);
    }

    // GET /api/districts (List All Districts)
    @GetMapping
    public ResponseEntity<List<District>> getAllDistricts() {
        List<District> districts = districtService.findAllDistricts();
        return ResponseEntity.ok(districts);
    }

    // GET /api/districts/{id} (Get District by ID)
    @GetMapping("/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable Long id) {
        District district = districtService.getDistrictById(id);

        return ResponseEntity.ok(district);
    }

    // PUT /api/districts/{id} (Update District)
    @PutMapping("/{id}")
    public ResponseEntity<District> updateDistrict(@PathVariable Long id, @Valid @RequestBody DistrictDTO dto) {
        District updatedDistrict = districtService.updateDistrict(id, dto);
        return ResponseEntity.ok(updatedDistrict);
    }

    // DELETE /api/districts/{id} (Delete District)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDistrict(@PathVariable Long id) {
        districtService.deleteDistrict(id);
    }
}