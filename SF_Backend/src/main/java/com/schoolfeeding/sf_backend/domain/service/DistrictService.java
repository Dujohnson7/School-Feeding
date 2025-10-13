package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.DistrictDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;

    // Constructor Injection
    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    // Helper method to find a district or throw an exception
    private District findDistrictById(Long id) {
        return districtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("District not found with ID: " + id));
    }

    /**
     * CRUD: Create (Add New District)
     * Ensures the district enum value is not already registered.
     */
    @Transactional
    public District createDistrict(DistrictDTO dto) {
        // Check for existing District by EDistrict enum name (which should be unique)
        if (districtRepository.findByDistrict(dto.getDistrict()).isPresent()) {
            throw new RuntimeException("District " + dto.getDistrict().name() + " is already registered.");
        }

        District district = new District();
        district.setProvince(dto.getProvince());
        district.setDistrict(dto.getDistrict());

        return districtRepository.save(district);
    }

    /**
     * CRUD: Read (List All Districts)
     */
    public List<District> findAllDistricts() {
        return districtRepository.findAll();
    }

    /**
     * CRUD: Read (Get District by ID)
     */
    public District getDistrictById(Long id) {
        return findDistrictById(id);
    }

    /**
     * CRUD: Update (Update District)
     * Allows changing the linked Province or updating the District enum if the new one is unique.
     */
    @Transactional
    public District updateDistrict(Long id, DistrictDTO dto) {
        District district = findDistrictById(id);

        // If the EDistrict enum is changing, ensure the new value is not already taken by another entity
        if (!district.getDistrict().equals(dto.getDistrict())) {
            if (districtRepository.findByDistrict(dto.getDistrict()).isPresent()) {
                throw new RuntimeException("Cannot change to " + dto.getDistrict().name() + " as it already exists.");
            }
            district.setDistrict(dto.getDistrict());
        }

        // Always update the province
        district.setProvince(dto.getProvince());
        
        return districtRepository.save(district);
    }

    /**
     * CRUD: Delete (Delete District by ID)
     */
    @Transactional
    public void deleteDistrict(Long id) {
        District district = findDistrictById(id);
        
        // NOTE: In a real system, you must handle foreign key constraints here. 
        // E.g., check if any Users or Schools are linked to this district before deletion.
        
        districtRepository.delete(district);
    }
}