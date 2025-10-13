package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID; // <--- ADD THIS IMPORT

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {

    // Custom method to check for unique school name during creation
    Optional<School> findByName(String name);

    // FIX: Changed name to findByDistrict_Id and parameter type to UUID.
    // This resolves the error: "Cannot compare left expression of type 'java.util.UUID' 
    // with right expression of type 'java.lang.Long'".
    List<School> findByDistrict_Id(UUID districtId); 
}