package com.schoolfeeding.sf_backend.repository.gov;

import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    long countAllByActive(Boolean active);
    long countAllByDistrict_IdAndActive(UUID districtId, Boolean active);
    @Query("SELECT  SUM(s.Student) as totalStudent FROM School  s WHERE s.district.id = :dId AND s.active = :active  GROUP BY s.id")
    long sumAllByDistrictStudentAndActive(@Param("dId")  UUID dId, @Param("active") Boolean active );

    @Query("SELECT  SUM(s.Student) as totalStudent FROM School  s WHERE  s.active = :active ")
    long sumByStudentAndActive(@Param("active") Boolean active );


    @Query("SELECT  SUM(s.Student) as totalStudent FROM School  s WHERE s.district.id = :dId AND s.active = :active  GROUP BY s.id")
    long sumAllOfStudent(@Param("dId")  UUID dId, @Param("active") Boolean active );



}
