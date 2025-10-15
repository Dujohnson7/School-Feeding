package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.DistrictDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    
    private District findDistrictById(UUID id) {
        return districtRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("District not found or deleted with ID: " + id));
    }

    
    @Transactional
    public District createDistrict(DistrictDTO dto) {
        District district = new District();
        district.setProvince(dto.getProvince());
        district.setDistrict(dto.getDistrict());
        district.setDeleted(false);
        district.setActive(true);
        return districtRepository.save(district);
    }

   
    public List<District> findAllDistricts() {
        return districtRepository.findByIsDeletedFalse();
    }

   
    public District getDistrictById(UUID id) {
        return findDistrictById(id);
    }

   
    @Transactional
    public District updateDistrict(UUID id, DistrictDTO dto) {
        District district = findDistrictById(id);

        
        district.setProvince(dto.getProvince());
        district.setDistrict(dto.getDistrict());

        return districtRepository.save(district);
    }

    
    @Transactional
    public void deleteDistrict(UUID id) {
        District district = findDistrictById(id);
        district.setDeleted(true);
        district.setActive(false);
        districtRepository.save(district);
    }

}
