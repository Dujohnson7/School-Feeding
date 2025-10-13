package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.SchoolDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final DistrictRepository districtRepository;

    public SchoolService(SchoolRepository schoolRepository, DistrictRepository districtRepository) {
        this.schoolRepository = schoolRepository;
        this.districtRepository = districtRepository;
    }

    // Helper method for error handling
    private School findSchoolById(Long id) {
        return schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + id));
    }

    /**
     * CRUD: Create (Add New School)
     */
    @Transactional
    public School createSchool(SchoolDTO dto) {
        // 1. Check for unique Name
        if (schoolRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("School with name '" + dto.getName() + "' already exists.");
        }

        // 2. Find and link District
        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new RuntimeException("District not found with ID: " + dto.getDistrictId()));

        // 3. Map DTO to Entity
        School school = new School();
        school.setName(dto.getName());
        school.setDirectorNames(dto.getDirectorNames());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());
        school.setDistrict(district); // Set the linked district
        school.setAddress(dto.getAddress());
        school.setBank(dto.getBank());
        school.setBankAccount(dto.getBankAccount());

        return schoolRepository.save(school);
    }

    /**
     * CRUD: Read (List All Schools)
     */
    public List<School> findAllSchools() {
        return schoolRepository.findAll();
    }

    /**
     * CRUD: Read (Get School by ID)
     */
    public School getSchoolById(Long id) {
        return findSchoolById(id);
    }

    /**
     * CRUD: Update (Update School)
     */
    @Transactional
    public School updateSchool(Long id, SchoolDTO dto) {
        School school = findSchoolById(id);

        // 1. Check unique name if it is being changed
        if (!school.getName().equals(dto.getName()) && schoolRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("School name '" + dto.getName() + "' is already taken.");
        }

        // 2. Check and update District link if ID changes
        if (!school.getDistrict().getId().equals(dto.getDistrictId())) {
            District newDistrict = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new RuntimeException("New District not found with ID: " + dto.getDistrictId()));
            school.setDistrict(newDistrict);
        }

        // 3. Update other fields
        school.setName(dto.getName());
        school.setDirectorNames(dto.getDirectorNames());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());
        school.setAddress(dto.getAddress());
        school.setBank(dto.getBank());
        school.setBankAccount(dto.getBankAccount());

        return schoolRepository.save(school);
    }

    /**
     * CRUD: Delete (Delete School by ID)
     */
    @Transactional
    public void deleteSchool(Long id) {
        School school = findSchoolById(id);
        // In a real application, you might want a soft delete or check for linked Users/Students first.
        schoolRepository.delete(school);
    }
}
