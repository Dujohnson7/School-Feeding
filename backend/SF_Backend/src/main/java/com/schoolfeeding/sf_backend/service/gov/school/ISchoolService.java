package com.schoolfeeding.sf_backend.service.gov.school;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.domain.entity.School;
import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;

import java.util.List;
import java.util.UUID;

public interface ISchoolService {
    School schoolSave(School theSchool);
    School schoolUpdate(School theSchool);
    School schoolDelete(School theSchool);
    School findById(UUID theId);
    List<School> findAllByDistrict(EDistrict theDistrict);
    List<School> findAllByProvince(EProvince theProvince);
    List<School> findAllByState(Boolean state);
    long countAllSchools(Boolean active);
    long countSchoolByDistricts(UUID  districtId);
    long sumAllByDistrictStudentAndState(UUID districtId);
    long sumByStudentAndState(Boolean state);
}
