package com.schoolfeeding.sf_backend.repository.gov;

import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ISchoolRepository extends JpaRepository<School, UUID> {
    List<School> findAllByActive(Boolean active);
    Optional<School>findSchoolByIdAndActive(UUID id, Boolean active);
    List<School> findAllByDistrict_DistrictAndActive(EDistrict districtDistrict, Boolean active);
    List<School> findAllByDistrict_ProvinceAndActive(EProvince province, Boolean active);

}
