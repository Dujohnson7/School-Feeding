package com.schoolfeeding.sf_backend.domain.repository;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DistrictRepository extends JpaRepository<District, UUID> {

    Optional<District> findByIdAndIsDeletedFalse(UUID id);

    List<District> findByIsDeletedFalse();
    long countByIsDeletedFalse();

    Optional<District> findByDistrict(EDistrict district);
}
