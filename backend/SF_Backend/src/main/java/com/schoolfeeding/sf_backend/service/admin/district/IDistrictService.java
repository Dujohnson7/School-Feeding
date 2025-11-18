package com.schoolfeeding.sf_backend.service.admin.district;

import com.schoolfeeding.sf_backend.domain.entity.District;
import com.schoolfeeding.sf_backend.util.address.EProvince;

import java.util.List;
import java.util.UUID;

public interface IDistrictService {
    District saveDistrict(District theDistrict);
    District updateDistrict(District theDistrict);
    District deleteDistrict(District theDistrict);
    District findDistrictByIdAndState (UUID theId, Boolean state);
    List<District> findAllDistrictsAndState(Boolean state);
    List<District> findDistrictsByProvinceAndState(EProvince province, Boolean state);
}
