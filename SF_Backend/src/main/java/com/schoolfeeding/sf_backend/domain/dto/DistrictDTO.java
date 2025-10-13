package com.schoolfeeding.sf_backend.domain.dto;

import com.schoolfeeding.sf_backend.util.address.EDistrict;
import com.schoolfeeding.sf_backend.util.address.EProvince;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DistrictDTO {

    @NotNull(message = "Province cannot be null")
    private EProvince province;

    @NotNull(message = "District cannot be null")
    private EDistrict district;
}