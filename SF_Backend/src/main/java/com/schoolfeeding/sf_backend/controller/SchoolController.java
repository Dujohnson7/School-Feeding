package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.SchoolDTO;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.service.SchoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;


    @PostMapping
    public ResponseEntity<School> createSchool(@Valid @RequestBody SchoolDTO dto) {
        return ResponseEntity.ok(schoolService.createSchool(dto));
    }


    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        return ResponseEntity.ok(schoolService.getAllSchools());
    }

    @GetMapping("/{id}")
    public ResponseEntity<School> getSchoolById(@PathVariable UUID id) {
        return ResponseEntity.ok(schoolService.getSchoolById(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<School> updateSchool(@PathVariable UUID id, @Valid @RequestBody SchoolDTO dto) {
        return ResponseEntity.ok(schoolService.updateSchool(id, dto));
    }

 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchool(@PathVariable UUID id) {
        schoolService.deleteSchool(id);
        return ResponseEntity.ok("School deleted (soft delete)");
    }
}

