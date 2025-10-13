package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {

    // Custom method to check if a district already exists by its Enum name
    Optional<District> findByDistrict(EDistrict district);
}