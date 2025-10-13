package com.schoolfeeding.sf_backend.controller;

import com.schoolfeeding.sf_backend.domain.dto.SchoolDTO;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.service.SchoolService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    // POST /api/schools (Create School)
    @PostMapping
    public ResponseEntity<School> createSchool(@Valid @RequestBody SchoolDTO dto) {
        School school = schoolService.createSchool(dto);
        return new ResponseEntity<>(school, HttpStatus.CREATED);
    }

    // GET /api/schools (List All Schools)
    @GetMapping
    public ResponseEntity<List<School>> getAllSchools() {
        List<School> schools = schoolService.findAllSchools();
        return ResponseEntity.ok(schools);
    }

    // GET /api/schools/{id} (Get School by ID)
    @GetMapping("/{id}")
    public ResponseEntity<School> getSchoolById(@PathVariable Long id) {
        School school = schoolService.getSchoolById(id);
        return ResponseEntity.ok(school);
    }

    // PUT /api/schools/{id} (Update School)
    @PutMapping("/{id}")
    public ResponseEntity<School> updateSchool(@PathVariable Long id, @Valid @RequestBody SchoolDTO dto) {
        School updatedSchool = schoolService.updateSchool(id, dto);
        return ResponseEntity.ok(updatedSchool);
    }

    // DELETE /api/schools/{id} (Delete School)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchool(@PathVariable Long id) {
        schoolService.deleteSchool(id);
    }
}
