package com.schoolfeeding.sf_backend.repository.admin;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IDistrictRepository extends JpaRepository<District, UUID> {
    Optional<District> findDistrictByIdAndActive(UUID id, Boolean active);

    List<District> findDistrictByProvinceAndActive(EProvince province,  Boolean active);

    List<District> findDistrictByActive(Boolean active);
}
