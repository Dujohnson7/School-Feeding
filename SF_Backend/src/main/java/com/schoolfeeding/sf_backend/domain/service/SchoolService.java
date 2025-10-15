package com.schoolfeeding.sf_backend.domain.service;

import com.schoolfeeding.sf_backend.domain.dto.SchoolDTO;
import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.domain.repository.SchoolRepository;
import com.schoolfeeding.sf_backend.domain.repository.DistrictRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final DistrictRepository districtRepository;

   
    public School createSchool(SchoolDTO dto) {
        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new EntityNotFoundException("District not found"));

        School school = new School();
        school.setName(dto.getName());
        school.setDirectorNames(dto.getDirectorNames());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());
        school.setDistrict(district);
        school.setAddress(dto.getAddress());
        school.setBank(dto.getBank());
        school.setBankAccount(dto.getBankAccount());
       
        school.setNumberStudent(dto.getNumberStudent()); 

        return schoolRepository.save(school);
    }

    
    public List<School> getAllSchools() {
        return schoolRepository.findByIsDeletedFalse();
    }

  
    public School getSchoolById(UUID id) {
        return schoolRepository.findById(id)
                .filter(s -> !s.getIsDeleted())
                .orElseThrow(() -> new EntityNotFoundException("School not found"));
    }

    public School updateSchool(UUID id, SchoolDTO dto) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("School not found"));

        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new EntityNotFoundException("District not found"));

        school.setName(dto.getName());
        school.setDirectorNames(dto.getDirectorNames());
        school.setEmail(dto.getEmail());
        school.setPhone(dto.getPhone());
        school.setDistrict(district);
        school.setAddress(dto.getAddress());
        school.setBank(dto.getBank());
        school.setBankAccount(dto.getBankAccount());
       
        school.setNumberStudent(dto.getNumberStudent()); 

        return schoolRepository.save(school);
    }

   
    public void deleteSchool(UUID id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("School not found"));
        school.setIsDeleted(true);
        schoolRepository.save(school);
    }
}